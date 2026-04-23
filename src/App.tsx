import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <HashRouter>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/product/:handle" element={<ProductPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  </TooltipProvider>
);

export default App;
