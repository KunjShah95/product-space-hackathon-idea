import { Slack, Twitter, FileText } from "lucide-react";

const integrations = [
  { name: "Slack", description: "Get instant alerts in your workspace", icon: Slack },
  { name: "Zendesk", description: "Auto-create and route tickets", icon: FileText },
  { name: "Twitter/X", description: "Monitor social mentions in real-time", icon: Twitter },
  { name: "Notion", description: "Document responses and workflows", icon: FileText },
  { name: "Jira", description: "Track issues end-to-end", icon: FileText },
  { name: "Google Sheets", description: "Export data for analysis", icon: FileText },
];

const Integrations = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Integrates with your stack
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect Lovable to the tools you already use every day
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 rounded-xl bg-background border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
            >
              <integration.icon className="w-10 h-10 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
              <p className="font-semibold text-sm text-center text-foreground mb-1">
                {integration.name}
              </p>
              <p className="text-xs text-muted-foreground text-center">
                {integration.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#" className="text-primary hover:text-primary/80 font-semibold inline-flex items-center gap-2 group">
            View all integrations
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Integrations;
