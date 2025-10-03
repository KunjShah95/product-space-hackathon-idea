import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Bell, Settings, LogOut, AlertCircle } from "lucide-react";

interface Mention {
  id: string;
  source: string;
  content: string;
  author: string | null;
  sentiment_score: number | null;
  urgency_score: number | null;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadMentions();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadMentions = async () => {
    try {
      const { data, error } = await supabase
        .from("mentions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setMentions(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load mentions",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getUrgencyColor = (score: number | null) => {
    if (!score) return "secondary";
    if (score >= 0.7) return "destructive";
    if (score >= 0.4) return "default";
    return "secondary";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Mentions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{mentions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {mentions.filter((m) => m.status === "pending").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>High Urgency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {mentions.filter((m) => (m.urgency_score || 0) >= 0.7).length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Mentions</CardTitle>
            <CardDescription>Latest mentions detected across your channels</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Loading...</p>
            ) : mentions.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No mentions yet</p>
                <p className="text-muted-foreground mb-4">
                  Connect your integrations to start monitoring
                </p>
                <Button onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Integrations
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {mentions.map((mention) => (
                  <div
                    key={mention.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{mention.source}</Badge>
                        <Badge variant={getUrgencyColor(mention.urgency_score)}>
                          {mention.urgency_score
                            ? `${(mention.urgency_score * 100).toFixed(0)}% urgent`
                            : "Low"}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(mention.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{mention.content}</p>
                    {mention.author && (
                      <p className="text-xs text-muted-foreground">By {mention.author}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
