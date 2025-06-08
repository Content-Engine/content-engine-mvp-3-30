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
import Layout from "@/components/Layout";
import LoginPage from "./pages/LoginPage";

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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected Routes wrapped with Layout */}
              <Route path="/dashboard" element={
                <Layout>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </Layout>
              } />
              
              <Route path="/user-management" element={
                <Layout>
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </RoleBasedRoute>
                </Layout>
              } />
              
              <Route path="/campaign-builder/*" element={
                <Layout>
                  <ProtectedRoute>
                    <CampaignBuilder />
                  </ProtectedRoute>
                </Layout>
              } />
              
              <Route path="/calendar" element={
                <Layout>
                  <ProtectedRoute>
                    <CalendarOverview />
                  </ProtectedRoute>
                </Layout>
              } />
              
              <Route path="/performance" element={
                <Layout>
                  <ProtectedRoute>
                    <PerformanceDashboard />
                  </ProtectedRoute>
                </Layout>
              } />
              
              <Route path="/qc-panel" element={
                <Layout>
                  <RoleBasedRoute allowedRoles={['admin', 'social_media_manager']}>
                    <QualityControlPanel />
                  </RoleBasedRoute>
                </Layout>
              } />
              
              <Route path="/payment-tiers" element={
                <Layout>
                  <ProtectedRoute>
                    <PaymentTiers />
                  </ProtectedRoute>
                </Layout>
              } />
              
              <Route path="/social-manager" element={
                <Layout>
                  <RoleBasedRoute allowedRoles={['admin', 'social_media_manager']}>
                    <SocialMediaManagerView />
                  </RoleBasedRoute>
                </Layout>
              } />
              
              <Route path="/editor-dashboard" element={
                <Layout>
                  <RoleBasedRoute allowedRoles={['admin', 'editor']}>
                    <EditorView />
                  </RoleBasedRoute>
                </Layout>
              } />
              
              <Route path="/social/*" element={
                <Layout>
                  <RoleBasedRoute allowedRoles={['admin', 'social_media_manager']}>
                    <SocialManagerDashboard />
                  </RoleBasedRoute>
                </Layout>
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
