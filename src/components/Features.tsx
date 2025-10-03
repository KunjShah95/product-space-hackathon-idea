import { Bell, Brain, MessageSquare, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Bell,
    title: "Real-time Monitoring",
    description: "Scan reviews, social, and forums for mentions.",
    benefit: "Always-on listening across web, app, and customer reviews.",
  },
  {
    icon: Brain,
    title: "AI Scoring & Triage",
    description: "Urgency, sentiment, reach — scored automatically.",
    benefit: "Surface what matters with intelligent prioritization.",
  },
  {
    icon: MessageSquare,
    title: "Recommended Replies",
    description: "Context-aware reply drafts & suggested owners.",
    benefit: "Draft responses tailored to the customer and context.",
  },
  {
    icon: Users,
    title: "Human-in-the-loop",
    description: "Escalate to Slack, create tickets, or assign from the app.",
    benefit: "Keep control while automating the routine work.",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Everything you need to stay ahead
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Lovable gives your team superpowers to detect, prioritize, and resolve customer issues 
            before they escalate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-medium text-foreground/80 mb-2">
                    {feature.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {feature.benefit}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
