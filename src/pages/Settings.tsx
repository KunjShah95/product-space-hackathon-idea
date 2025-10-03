import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Slack, Twitter, Settings as SettingsIcon } from "lucide-react";

interface Integration {
  id: string;
  integration_type: string;
  api_key: string | null;
  webhook_url: string | null;
  is_active: boolean;
}

const integrationIcons: Record<string, any> = {
  slack: Slack,
  twitter: Twitter,
};

const integrationLabels: Record<string, string> = {
  slack: "Slack",
  twitter: "Twitter/X",
  zendesk: "Zendesk",
  jira: "Jira",
  google_sheets: "Google Sheets",
  notion: "Notion",
};

export default function Settings() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        loadIntegrations();
      }
    });
  }, [navigate]);

  const loadIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from("integrations")
        .select("*");

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load integrations",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateIntegration = async (type: string, field: string, value: any) => {
    const existing = integrations.find((i) => i.integration_type === type);

    if (existing) {
      const updated = integrations.map((i) =>
        i.integration_type === type ? { ...i, [field]: value } : i
      );
      setIntegrations(updated);
    } else {
      const newIntegration: Partial<Integration> = {
        integration_type: type,
        [field]: value,
        is_active: false,
      };
      setIntegrations([...integrations, newIntegration as Integration]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const integration of integrations) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) continue;

        const { error } = await supabase
          .from("integrations")
          .upsert({
            user_id: user.id,
            integration_type: integration.integration_type,
            api_key: integration.api_key,
            webhook_url: integration.webhook_url,
            is_active: integration.is_active,
          }, {
            onConflict: 'user_id,integration_type'
          });

        if (error) throw error;
      }

      toast({
        title: "Settings saved",
        description: "Your integration settings have been updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save settings",
      });
    } finally {
      setSaving(false);
    }
  };

  const getIntegrationValue = (type: string, field: string) => {
    const integration = integrations.find((i) => i.integration_type === type);
    return integration?.[field as keyof Integration] || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-heading font-bold">Settings</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API Integrations</CardTitle>
            <CardDescription>
              Connect your tools to start monitoring mentions. You'll need API keys from each service.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(integrationLabels).map(([type, label]) => {
              const Icon = integrationIcons[type] || SettingsIcon;
              return (
                <div key={type}>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">{label}</h3>
                  </div>

                  <div className="space-y-4 ml-8">
                    <div className="space-y-2">
                      <Label htmlFor={`${type}-key`}>API Key</Label>
                      <Input
                        id={`${type}-key`}
                        type="password"
                        placeholder="Enter your API key"
                        value={getIntegrationValue(type, "api_key") as string}
                        onChange={(e) =>
                          updateIntegration(type, "api_key", e.target.value)
                        }
                      />
                    </div>

                    {type === "slack" && (
                      <div className="space-y-2">
                        <Label htmlFor={`${type}-webhook`}>Webhook URL</Label>
                        <Input
                          id={`${type}-webhook`}
                          type="url"
                          placeholder="https://hooks.slack.com/..."
                          value={getIntegrationValue(type, "webhook_url") as string}
                          onChange={(e) =>
                            updateIntegration(type, "webhook_url", e.target.value)
                          }
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${type}-active`}
                        checked={getIntegrationValue(type, "is_active") as boolean}
                        onCheckedChange={(checked) =>
                          updateIntegration(type, "is_active", checked)
                        }
                      />
                      <Label htmlFor={`${type}-active`}>Enable integration</Label>
                    </div>
                  </div>

                  <Separator className="mt-6" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Getting Your API Keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Slack</h4>
              <p className="text-muted-foreground">
                Create a Slack app and get your webhook URL from the Incoming Webhooks section.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Twitter/X</h4>
              <p className="text-muted-foreground">
                Apply for Twitter API access and generate your API keys from the Developer Portal.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Other Integrations</h4>
              <p className="text-muted-foreground">
                Visit each service's developer documentation to obtain your API credentials.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
