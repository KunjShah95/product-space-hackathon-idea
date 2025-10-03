import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Lovable helped us reduce customer escalations by 47% in just three months. The AI-powered triage is a game-changer.",
    author: "Sarah Chen",
    role: "Head of Support, TechFlow",
  },
  {
    quote: "We catch negative reviews within minutes instead of days. Our response time improved dramatically.",
    author: "Michael Rodriguez",
    role: "Product Manager, GrowthLabs",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Trusted by teams who care
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Lovable helps product teams stay ahead of customer issues
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2 hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <Quote className="w-10 h-10 text-primary/30" />
                <p className="text-lg text-foreground/90 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 max-w-3xl mx-auto text-center">
          <div className="space-y-4">
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              47% reduction in escalations
            </p>
            <p className="text-muted-foreground">
              Average improvement in first 90 days across our customers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
