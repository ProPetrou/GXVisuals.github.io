import Header from "@/components/Header";
import Portfolio from "@/components/Portfolio";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/hooks/useLang";
import { setPageMeta } from "@/lib/seo";

const PortfolioPage = () => {
  const { t } = useTranslation();
  const { lang, lp } = useLang();

  useEffect(() => {
    setPageMeta({ title: t("meta_portfolio_title"), description: t("meta_portfolio_desc"), path: "/portfolio", lang });
  }, [lang, t]);

  // Πάντα στην κορυφή όταν ανοίγει η σελίδα
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Navigation Back */}
          <div className="mb-12 animate-fade-in">
            <Button asChild variant="ghost" className="hover:text-primary -ml-4">
              <Link to={lp("/")} className="flex items-center gap-2">
                <ArrowLeft size={16} />
                <span>{t("back_home")}</span>
              </Link>
            </Button>
          </div>

          {/* Header Section */}
          <div className="max-w-3xl mb-16 animate-fade-up">
            <span className="text-primary font-body text-sm tracking-widest uppercase mb-4 block">
              {t("portfolio_page_eyebrow")}
            </span>
            <h1 className="font-display text-5xl md:text-7xl mb-6 italic">
              {t("portfolio_page_title_1")} <span className="text-gradient">{t("portfolio_page_title_2")}</span>
            </h1>
            <p className="text-muted-foreground text-lg font-body leading-relaxed">
              {t("portfolio_page_sub")}
            </p>
          </div>

          {/* Το Grid του Portfolio */}
          <div className="animate-fade-up [animation-delay:200ms]">
            <Portfolio />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PortfolioPage;
