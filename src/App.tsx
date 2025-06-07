
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CampaignBuilder from "./pages/CampaignBuilder";
import CampaignBuilderStep1 from "./pages/CampaignBuilderStep1";
import CampaignBuilderStep2 from "./pages/CampaignBuilderStep2";
import CampaignBuilderStep3 from "./pages/CampaignBuilderStep3";
import CampaignBuilderStep4 from "./pages/CampaignBuilderStep4";
import CampaignBuilderStep5 from "./pages/CampaignBuilderStep5";
import CalendarOverview from "./pages/CalendarOverview";
import PerformanceDashboard from "./pages/PerformanceDashboard";
import QualityControlPanel from "./pages/QualityControlPanel";
import PaymentTiers from "./pages/PaymentTiers";
import SocialMediaManagerView from "./pages/SocialMediaManagerView";
import EditorView from "./pages/EditorView";
import SocialManagerDashboard from "./pages/SocialManagerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/campaign-builder" element={
              <ProtectedRoute>
                <CampaignBuilder />
              </ProtectedRoute>
            } />
            <Route path="/campaign-builder/step1" element={
              <ProtectedRoute>
                <CampaignBuilderStep1 />
              </ProtectedRoute>
            } />
            <Route path="/campaign-builder/step2" element={
              <ProtectedRoute>
                <CampaignBuilderStep2 />
              </ProtectedRoute>
            } />
            <Route path="/campaign-builder/step3" element={
              <ProtectedRoute>
                <CampaignBuilderStep3 />
              </ProtectedRoute>
            } />
            <Route path="/campaign-builder/step4" element={
              <ProtectedRoute>
                <CampaignBuilderStep4 />
              </ProtectedRoute>
            } />
            <Route path="/campaign-builder/step5" element={
              <ProtectedRoute>
                <CampaignBuilderStep5 />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <CalendarOverview />
              </ProtectedRoute>
            } />
            <Route path="/performance" element={
              <ProtectedRoute>
                <PerformanceDashboard />
              </ProtectedRoute>
            } />
            <Route path="/qc-panel" element={
              <ProtectedRoute>
                <QualityControlPanel />
              </ProtectedRoute>
            } />
            <Route path="/payment-tiers" element={
              <ProtectedRoute>
                <PaymentTiers />
              </ProtectedRoute>
            } />
            <Route path="/social-manager" element={
              <ProtectedRoute>
                <SocialMediaManagerView />
              </ProtectedRoute>
            } />
            <Route path="/editor-dashboard" element={
              <ProtectedRoute>
                <EditorView />
              </ProtectedRoute>
            } />
            <Route path="/social/*" element={
              <ProtectedRoute>
                <SocialManagerDashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
