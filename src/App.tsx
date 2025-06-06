
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import PaymentTiers from "./pages/PaymentTiers";
import CampaignBuilderStep1 from "./pages/CampaignBuilderStep1";
import CampaignBuilderStep2 from "./pages/CampaignBuilderStep2";
import CampaignBuilderStep3 from "./pages/CampaignBuilderStep3";
import CampaignBuilderStep4 from "./pages/CampaignBuilderStep4";
import CampaignBuilderStep5 from "./pages/CampaignBuilderStep5";
import CampaignsDashboard from "./pages/CampaignsDashboard";
import PerformanceDashboard from "./pages/PerformanceDashboard";
import QualityControlPanel from "./pages/QualityControlPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/campaign-builder/step-1" element={<CampaignBuilderStep1 />} />
          <Route path="/campaign-builder/step-2" element={<CampaignBuilderStep2 />} />
          <Route path="/campaign-builder/step-3" element={<CampaignBuilderStep3 />} />
          <Route path="/campaign-builder/step-4" element={<CampaignBuilderStep4 />} />
          <Route path="/campaign-builder/step-5" element={<CampaignBuilderStep5 />} />
          <Route path="/campaigns-dashboard" element={<CampaignsDashboard />} />
          <Route path="/performance-dashboard" element={<PerformanceDashboard />} />
          <Route path="/quality-control" element={<QualityControlPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
