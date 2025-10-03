import { Database, Sparkles, Zap } from "lucide-react";

const steps = [
  {
    icon: Database,
    title: "Ingest",
    description: "Connect your data sources — reviews, social media, support tickets, and more.",
  },
  {
    icon: Sparkles,
    title: "Score",
    description: "AI analyzes sentiment, urgency, and reach to prioritize what needs attention now.",
  },
  {
    icon: Zap,
    title: "Act",
    description: "Get suggested replies, assign to team members, or escalate to your tools automatically.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps from detection to resolution
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent -z-10" />
            
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative flex flex-col items-center text-center space-y-4 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-4 border-background shadow-lg relative z-10">
                  <step.icon className="w-12 h-12 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="md:hidden w-0.5 h-12 bg-gradient-to-b from-primary to-secondary absolute -bottom-10 left-1/2 -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
