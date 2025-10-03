import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-12">
            <a href="/" className="text-2xl font-bold text-primary">
              Lovable
            </a>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Product
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                How it works
              </a>
              <a href="#integrations" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Integrations
              </a>
              <a href="#pricing" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#docs" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Docs
              </a>
              <a href="#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
              Try for Free
            </Button>
            <Button size="sm" onClick={() => navigate("/auth")}>
              Get Demo
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Product
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                How it works
              </a>
              <a href="#integrations" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Integrations
              </a>
              <a href="#pricing" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#docs" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Docs
              </a>
              <a href="#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Contact
              </a>
              <div className="flex flex-col gap-2 pt-4">
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/auth")}>
                  Try for Free
                </Button>
                <Button size="sm" className="w-full" onClick={() => navigate("/auth")}>
                  Get Demo
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
