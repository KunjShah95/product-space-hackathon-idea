import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.jpg";
import dashboardMock from "@/assets/dashboard-mock.jpg";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Stop surprises. Resolve issues{" "}
                <span className="text-primary">before they blow up.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Lovable detects negative mentions across web & in-app, prioritizes what matters, 
                and helps your team respond — fast.
              </p>
            </div>

            <ul className="space-y-3 text-foreground/90">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Real-time monitoring of reviews, social media, and forums</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>AI-powered urgency scoring and sentiment analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Smart reply suggestions with human-in-the-loop control</span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="text-lg px-8 hover:scale-105 transition-transform" onClick={() => navigate("/auth")}>
                Get Demo
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 hover:scale-105 transition-transform" onClick={() => navigate("/auth")}>
                <Play className="mr-2 h-5 w-5" />
                Try for Free
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              We'll send a 15-min demo and a sandbox account — no credit card required.
            </p>
          </div>

          <div className="relative animate-fade-in animation-delay-200">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-card">
              <img 
                src={dashboardMock} 
                alt="Lovable dashboard showing real-time alerts and sentiment analysis"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-secondary/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
