import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleBasedRoute from "@/components/RoleBasedRoute";
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
              
              {/* Social Manager Dashboard Redirect */}
              <Route 
                path="/social-manager-dashboard" 
                element={<Navigate to="/social-manager" replace />} 
              />
              
              {/* Protected Dashboard Route */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Campaign Builder Routes */}
              <Route 
                path="/campaign-builder" 
                element={
                  <ProtectedRoute>
                    <CampaignBuilder />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/campaign-builder/step/:stepNumber" 
                element={
                  <ProtectedRoute>
                    <CampaignBuilder />
                  </ProtectedRoute>
                } 
              />
              
              {/* New Campaign Builder V2 Route */}
              <Route 
                path="/campaign-builder-v2" 
                element={
                  <ProtectedRoute>
                    <CampaignBuilder />
                  </ProtectedRoute>
                } 
              />
              
              {/* Campaign Overview Route */}
              <Route 
                path="/campaign-overview" 
                element={
                  <ProtectedRoute>
                    <Campaigns />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/campaigns" 
                element={
                  <ProtectedRoute>
                    <Campaigns />
                  </ProtectedRoute>
                } 
              />
              
              {/* Editor Route - Role-based access */}
              <Route 
                path="/editor" 
                element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['admin', 'editor']}>
                      <EditorView />
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/editor-view" 
                element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['admin', 'editor']}>
                      <EditorView />
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Route - Admin only access */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['admin']}>
                      <UserManagement />
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } 
              />
              
              {/* Social Manager Routes - Primary route structure */}
              <Route 
                path="/social-manager/*" 
                element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['admin', 'social_media_manager']}>
                      <SocialManagerDashboard />
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/social-media-manager-view" 
                element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['admin', 'social_media_manager']}>
                      <SocialMediaManagerView />
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } 
              />
              
              {/* Other Protected Routes */}
              <Route 
                path="/calendar-overview" 
                element={
                  <ProtectedRoute>
                    <CalendarOverview />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/performance-dashboard" 
                element={
                  <ProtectedRoute>
                    <PerformanceDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/quality-control-panel" 
                element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['admin', 'editor']}>
                      <QualityControlPanel />
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/client-portal" 
                element={
                  <ProtectedRoute>
                    <ClientPortal />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="/payment-tiers" element={<PaymentTiers />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />
              
              <Route 
                path="/user-management" 
                element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['admin']}>
                      <UserManagement />
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } 
              />
              
              <Route path="/invitation-response" element={<InvitationResponse />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
