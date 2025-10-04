import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const REDDIT_CLIENT_ID = Deno.env.get('REDDIT_CLIENT_ID');
    const REDDIT_CLIENT_SECRET = Deno.env.get('REDDIT_CLIENT_SECRET');
    const TWITTER_BEARER_TOKEN = Deno.env.get('TWITTER_BEARER_TOKEN');
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    // Get all active integrations
    const { data: integrations, error: intError } = await supabase
      .from('integrations')
      .select('*')
      .eq('is_active', true);

    if (intError) throw intError;

    const mentions = [];

    for (const integration of integrations || []) {
      try {
        if (integration.integration_type === 'reddit' && integration.config?.client_id && integration.config?.client_secret) {
          // Get Reddit access token
          const authString = btoa(`${integration.config.client_id}:${integration.config.client_secret}`);
          const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${authString}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
          });

          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            
            // Search for mentions (replace 'YourBrand' with actual search term)
            const searchResponse = await fetch('https://oauth.reddit.com/search?q=YourBrand&sort=new&limit=10', {
              headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
                'User-Agent': 'MentionMonitor/1.0',
              },
            });

            if (searchResponse.ok) {
              const searchData = await searchResponse.json();
              for (const post of searchData.data?.children || []) {
                mentions.push({
                  user_id: integration.user_id,
                  source: 'reddit',
                  content: post.data.title + ' ' + (post.data.selftext || ''),
                  author: post.data.author,
                  url: `https://reddit.com${post.data.permalink}`,
                  status: 'pending',
                });
              }
            }
          }
        }

        if (integration.integration_type === 'twitter' && integration.config?.bearer_token) {
          // Search Twitter for mentions (replace 'YourBrand' with actual search term)
          const twitterResponse = await fetch('https://api.twitter.com/2/tweets/search/recent?query=YourBrand&max_results=10', {
            headers: {
              'Authorization': `Bearer ${integration.config.bearer_token}`,
            },
          });

          if (twitterResponse.ok) {
            const twitterData = await twitterResponse.json();
            for (const tweet of twitterData.data || []) {
              mentions.push({
                user_id: integration.user_id,
                source: 'twitter',
                content: tweet.text,
                author: tweet.author_id,
                url: `https://twitter.com/i/web/status/${tweet.id}`,
                status: 'pending',
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching from ${integration.integration_type}:`, error);
      }
    }

    // Analyze sentiment and save mentions
    for (const mention of mentions) {
      try {
        // Use Gemini for sentiment analysis
        const sentimentResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Analyze the sentiment of this text and return only a number between -1 (very negative) and 1 (very positive): "${mention.content}"`
              }]
            }]
          }),
        });

        let sentimentScore = 0;
        if (sentimentResponse.ok) {
          const sentimentData = await sentimentResponse.json();
          const text = sentimentData.candidates?.[0]?.content?.parts?.[0]?.text || '0';
          sentimentScore = parseFloat(text.match(/-?\d+\.?\d*/)?.[0] || '0');
        }

        // Save mention to database
        const { error: insertError } = await supabase
          .from('mentions')
          .insert({
            ...mention,
            sentiment_score: sentimentScore,
            urgency_score: sentimentScore < -0.5 ? 0.8 : 0.3,
          });

        if (insertError) throw insertError;

        // Send Slack notification if sentiment is negative
        if (sentimentScore < -0.3) {
          const { data: slackIntegration } = await supabase
            .from('integrations')
            .select('webhook_url')
            .eq('user_id', mention.user_id)
            .eq('integration_type', 'slack')
            .eq('is_active', true)
            .single();

          if (slackIntegration?.webhook_url) {
            await fetch(slackIntegration.webhook_url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                text: `⚠️ Negative mention detected!\nSource: ${mention.source}\nSentiment: ${sentimentScore.toFixed(2)}\nContent: ${mention.content.substring(0, 200)}...\nURL: ${mention.url}`,
              }),
            });
          }
        }
      } catch (error) {
        console.error('Error processing mention:', error);
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: mentions.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in monitor-mentions:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
