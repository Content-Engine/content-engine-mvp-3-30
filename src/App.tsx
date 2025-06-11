
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleBasedRoute from "@/components/RoleBasedRoute";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CampaignBuilder from "./pages/CampaignBuilder";
import CalendarOverview from "./pages/CalendarOverview";
import SocialMediaManagerView from "./pages/SocialMediaManagerView";
import SocialManagerDashboard from "./pages/SocialManagerDashboard";
import EditorView from "./pages/EditorView";
import QualityControlPanel from "./pages/QualityControlPanel";
import UserManagement from "./pages/UserManagement";
import PaymentTiers from "./pages/PaymentTiers";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import ClientPortal from "./pages/ClientPortal";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes - now inside AuthProvider */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/payment-tiers" element={<PaymentTiers />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes */}
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
            
            {/* Fix missing syndication route */}
            <Route path="/syndication" element={
              <ProtectedRoute>
                <CampaignBuilder />
              </ProtectedRoute>
            } />
            
            {/* Fix campaign builder step routes */}
            <Route path="/campaign-builder/step/:stepNumber" element={
              <ProtectedRoute>
                <CampaignBuilder />
              </ProtectedRoute>
            } />
            
            <Route path="/calendar" element={
              <ProtectedRoute>
                <CalendarOverview />
              </ProtectedRoute>
            } />
            
            <Route path="/client-portal" element={
              <ProtectedRoute>
                <ClientPortal />
              </ProtectedRoute>
            } />
            
            {/* Role-based routes */}
            <Route path="/social-manager/*" element={
              <RoleBasedRoute allowedRoles={['admin', 'social_media_manager']}>
                <SocialManagerDashboard />
              </RoleBasedRoute>
            } />
            
            <Route path="/social-media-manager" element={
              <RoleBasedRoute allowedRoles={['admin', 'social_media_manager']}>
                <SocialMediaManagerView />
              </RoleBasedRoute>
            } />
            
            <Route path="/editor" element={
              <RoleBasedRoute allowedRoles={['admin', 'editor']}>
                <EditorView />
              </RoleBasedRoute>
            } />
            
            <Route path="/quality-control" element={
              <RoleBasedRoute allowedRoles={['admin', 'social_media_manager']}>
                <QualityControlPanel />
              </RoleBasedRoute>
            } />
            
            <Route path="/user-management" element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <UserManagement />
              </RoleBasedRoute>
            } />
            
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
