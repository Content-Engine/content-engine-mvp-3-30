import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleBasedRoute from "@/components/RoleBasedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
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
import Unauthorized from "./pages/Unauthorized";
import UserManagement from "./pages/UserManagement";

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
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Admin Routes */}
              <Route path="/dashboard" element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <Dashboard />
                </RoleBasedRoute>
              } />
              <Route path="/user-management" element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </RoleBasedRoute>
              } />
              <Route path="/campaign-builder" element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <CampaignBuilder />
                </RoleBasedRoute>
              } />
              <Route path="/calendar" element={
                <RoleBasedRoute allowedRoles={['admin', 'social_media_manager']}>
                  <CalendarOverview />
                </RoleBasedRoute>
              } />
              <Route path="/performance" element={
                <RoleBasedRoute allowedRoles={['admin', 'social_media_manager']}>
                  <PerformanceDashboard />
                </RoleBasedRoute>
              } />
              <Route path="/qc-panel" element={
                <RoleBasedRoute allowedRoles={['admin', 'social_media_manager']}>
                  <QualityControlPanel />
                </RoleBasedRoute>
              } />
              <Route path="/payment-tiers" element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <PaymentTiers />
                </RoleBasedRoute>
              } />
              <Route path="/social-manager" element={
                <RoleBasedRoute allowedRoles={['admin', 'social_media_manager']}>
                  <SocialMediaManagerView />
                </RoleBasedRoute>
              } />
              
              {/* Editor Routes */}
              <Route path="/editor-dashboard" element={
                <RoleBasedRoute allowedRoles={['admin', 'editor']}>
                  <EditorView />
                </RoleBasedRoute>
              } />
              
              {/* Social Manager Dashboard Routes */}
              <Route path="/social/*" element={
                <RoleBasedRoute allowedRoles={['admin', 'social_media_manager']}>
                  <SocialManagerDashboard />
                </RoleBasedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
