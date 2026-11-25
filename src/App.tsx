import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import NewsletterPopup from "@/components/NewsletterPopup";
import LanguageSync from "@/components/LanguageSync";
import Index from "./pages/Index";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MobileQuotePrompt from "@/components/MobileQuotePrompt";

const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const MarketLandingPage = lazy(() => import("./pages/MarketLandingPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <NewsletterPopup />
        <LanguageSync>
          <Suspense fallback={<div className="h-screen w-full bg-[#121212]" />}>
            <Routes>
              {/* English (default) */}
              <Route path="/" element={<Index />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/free-quote" element={<LandingPage />} />
              <Route path="/cyprus" element={<MarketLandingPage market="cyprus" />} />
              <Route path="/uk" element={<MarketLandingPage market="uk" />} />
  
              {/* Greek */}
              <Route path="/el" element={<Index />} />
              <Route path="/el/portfolio" element={<PortfolioPage />} />
              <Route path="/el/free-quote" element={<LandingPage />} />
              <Route path="/el/cyprus" element={<MarketLandingPage market="cyprus" />} />
            </Routes>
            <MobileQuotePrompt />
          </Suspense>
        </LanguageSync>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
