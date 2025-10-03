import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How does Lovable protect our customer data?",
    answer: "We use bank-level encryption (AES-256) for data at rest and in transit. We're GDPR and CCPA compliant, and SOC 2 Type II certified. You have full control over data retention and can delete data at any time.",
  },
  {
    question: "Which integrations are supported?",
    answer: "We support all major platforms including Slack, Zendesk, Jira, Notion, Twitter/X, Google Sheets, and more. Enterprise plans can request custom integrations. Check our integrations page for the full list.",
  },
  {
    question: "How accurate is the sentiment detection?",
    answer: "Our AI model achieves 94% accuracy on sentiment classification. We continuously train on customer support data and provide confidence scores. You can also provide feedback to improve accuracy for your specific use case.",
  },
  {
    question: "What languages does Lovable support?",
    answer: "We support 30+ languages including English, Spanish, French, German, Portuguese, Japanese, Korean, Chinese, and more. Contact us if you need a specific language added.",
  },
  {
    question: "What happens during the free trial?",
    answer: "You get full access to all Pro features for 14 days. No credit card required. We'll send you reminders before the trial ends, and you won't be charged unless you choose to continue.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel anytime with no penalties. We offer monthly and annual billing. If you cancel, you'll have access until the end of your billing period.",
  },
];

const FAQ = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Frequently asked questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Lovable
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-2 rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Button variant="outline" size="lg">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
