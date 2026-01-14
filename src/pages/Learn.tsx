import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen } from "lucide-react";

const Learn = () => {
  const articles = [
    {
      id: 1,
      title: "Understanding Eczema",
      category: "Common Conditions",
      description: "Learn about the causes, symptoms, and management of eczema (atopic dermatitis).",
      readTime: "5 min read",
      link: "https://nationaleczema.org/eczema/",
    },
    {
      id: 2,
      title: "Acne: Causes and Treatments",
      category: "Common Conditions",
      description: "A comprehensive guide to understanding acne triggers and effective treatment options.",
      readTime: "7 min read",
      link: "https://www.aad.org/public/diseases/acne",
    },
    {
      id: 3,
      title: "Skin Cancer Prevention",
      category: "Prevention",
      description: "Essential tips for protecting your skin from harmful UV rays and early detection.",
      readTime: "6 min read",
      link: "https://www.skincancer.org/skin-cancer-information/",
    },
    {
      id: 4,
      title: "Daily Skincare Routine",
      category: "Skincare Tips",
      description: "Build a healthy skincare routine that works for your specific skin type.",
      readTime: "4 min read",
      link: "https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-routine",
    },
    {
      id: 5,
      title: "Psoriasis Awareness",
      category: "Autoimmune",
      description: "Understand psoriasis triggers, types, and how to manage flare-ups effectively.",
      readTime: "6 min read",
      link: "https://www.psoriasis.org/about-psoriasis/",
    },
    {
      id: 6,
      title: "Living with Rosacea",
      category: "Chronic Conditions",
      description: "Identify rosacea subtypes and learn lifestyle changes to reduce redness.",
      readTime: "5 min read",
      link: "https://www.rosacea.org/",
    },
    {
      id: 7,
      title: "Melanoma: What You Need to Know",
      category: "Serious Conditions",
      description: "Early warning signs of melanoma and the ABCDEs of mole checking.",
      readTime: "8 min read",
      link: "https://www.cancer.org/cancer/melanoma-skin-cancer.html",
    },
    {
      id: 8,
      title: "Understanding Vitiligo",
      category: "Pigmentation",
      description: "Causes, treatments, and emotional support for those with vitiligo.",
      readTime: "5 min read",
      link: "https://www.niams.nih.gov/health-topics/vitiligo",
    },
  ];

  const handleArticleClick = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Learn About Skin Health</h1>
            <p className="text-muted-foreground">
              Browse articles and resources about common skin conditions and care
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50"
                onClick={() => handleArticleClick(article.link)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {article.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  </div>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-primary font-medium group">
                    <BookOpen className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="group-hover:underline">Read article</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
