
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CampaignBuilder from "./pages/CampaignBuilder";
import Campaigns from "./pages/Campaigns";
import EditorView from "./pages/EditorView";
import SocialManagerDashboard from "./pages/SocialManagerDashboard";
import SocialMediaManagerView from "./pages/SocialMediaManagerView";
import CalendarOverview from "./pages/CalendarOverview";
import PerformanceDashboard from "./pages/PerformanceDashboard";
import QualityControlPanel from "./pages/QualityControlPanel";
import ClientPortal from "./pages/ClientPortal";
import PaymentTiers from "./pages/PaymentTiers";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import UserManagement from "./pages/UserManagement";
import InvitationResponse from "./pages/InvitationResponse";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login-page" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/campaign-builder" element={<CampaignBuilder />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/editor-view" element={<EditorView />} />
              <Route path="/social-manager-dashboard" element={<SocialManagerDashboard />} />
              <Route path="/social-media-manager-view" element={<SocialMediaManagerView />} />
              <Route path="/calendar-overview" element={<CalendarOverview />} />
              <Route path="/performance-dashboard" element={<PerformanceDashboard />} />
              <Route path="/quality-control-panel" element={<QualityControlPanel />} />
              <Route path="/client-portal" element={<ClientPortal />} />
              <Route path="/payment-tiers" element={<PaymentTiers />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/invitation-response" element={<InvitationResponse />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
