import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import FAQPage from "./pages/FAQPage";
import DeliveryAreaPage from "./pages/DeliveryAreaPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import NotFound from "./pages/NotFound";

const siteMode = import.meta.env.VITE_SITE_MODE || "live";
const isComingSoonMode = siteMode === "coming-soon";

const App = () => (
  <TooltipProvider>
    <HashRouter>
      <Toaster />
      <Sonner />
      <Routes>
        {isComingSoonMode ? (
          <>
            <Route path="/" element={<ComingSoonPage />} />
            <Route path="*" element={<ComingSoonPage />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Index />} />
            <Route path="/product/:handle" element={<ProductPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/delivery-area" element={<DeliveryAreaPage />} />
            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
    </HashRouter>
  </TooltipProvider>
);

export default App;
