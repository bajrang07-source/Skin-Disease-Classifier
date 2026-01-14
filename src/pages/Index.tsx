import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Calendar, MapPin, Shield, Sparkles, Users, Activity } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Camera,
      title: "Instant Analysis",
      description: "Upload a photo and get immediate AI-powered predictions for skin conditions.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your images are processed and immediately deleted. We never store your photos.",
    },
    {
      icon: Users,
      title: "Find Specialists",
      description: "Connect with verified dermatologists and specialists near you.",
    },
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Schedule appointments and get reminders for upcoming consultations.",
    },
    {
      icon: MapPin,
      title: "Disease Mapping",
      description: "View trends and insights about skin conditions in your area.",
    },
    {
      icon: Sparkles,
      title: "AI Guidance",
      description: "Get personalized do's and don'ts for managing your skin health.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-6">
            Your Skin Health,{" "}
            <span className="text-primary">Powered by AI</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get instant predictions for skin conditions, connect with dermatologists, 
            and take control of your skin health—all from your phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base">
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base">
              <Link to="/learn">Learn More</Link>
            </Button>
          </div>
          
          {/* Privacy Notice */}
          <div className="mt-8 p-4 bg-secondary rounded-lg border border-border inline-flex items-start gap-3 text-left max-w-md mx-auto">
            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Privacy guaranteed:</strong> Images are analyzed and 
              immediately deleted. We never store your photos.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container px-4 py-16 bg-muted/50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need for Better Skin Health
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Skin Health Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who trust SkinWise for their skin health needs.
          </p>
          <Button asChild size="lg" className="text-base">
            <Link to="/auth">Create Free Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="font-semibold">SkinWise</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2025 SkinWise. Your privacy is our priority.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
