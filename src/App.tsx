import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleBasedRoute from "@/components/RoleBasedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CampaignBuilder from "./pages/CampaignBuilder";
import CalendarOverview from "./pages/CalendarOverview";
import PerformanceDashboard from "./pages/PerformanceDashboard";
import QualityControlPanel from "./pages/QualityControlPanel";
import PaymentTiers from "./pages/PaymentTiers";
import SocialMediaManagerView from "./pages/SocialMediaManagerView";
import EditorView from "./pages/EditorView";
import SocialManagerDashboard from "./pages/SocialManagerDashboard";
import NotFound from "./pages/NotFound";
import UserManagement from "./pages/UserManagement";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/user-management" element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </RoleBasedRoute>
              } />
              
              <Route path="/campaign-builder/*" element={
                <ProtectedRoute>
                  <CampaignBuilder />
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
                <RoleBasedRoute allowedRoles={['admin', 'social_media_manager']}>
                  <QualityControlPanel />
                </RoleBasedRoute>
              } />
              
              <Route path="/payment-tiers" element={
                <ProtectedRoute>
                  <PaymentTiers />
                </ProtectedRoute>
              } />
              
              <Route path="/social-manager" element={
                <RoleBasedRoute allowedRoles={['admin', 'social_media_manager']}>
                  <SocialMediaManagerView />
                </RoleBasedRoute>
              } />
              
              <Route path="/editor-dashboard" element={
                <RoleBasedRoute allowedRoles={['admin', 'editor']}>
                  <EditorView />
                </RoleBasedRoute>
              } />
              
              <Route path="/social/*" element={
                <RoleBasedRoute allowedRoles={['admin', 'social_media_manager']}>
                  <SocialManagerDashboard />
                </RoleBasedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
