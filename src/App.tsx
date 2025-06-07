
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy load components
const Index = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const CampaignBuilder = lazy(() => import("@/pages/CampaignBuilder"));
const CalendarOverview = lazy(() => import("@/pages/CalendarOverview"));
const QualityControlPanel = lazy(() => import("@/pages/QualityControlPanel"));
const EditorView = lazy(() => import("@/pages/EditorView"));
const PaymentTiers = lazy(() => import("@/pages/PaymentTiers"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center">
              <div className="text-white text-xl">Loading...</div>
            </div>
          }>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Campaign Builder Routes - Fixed routing */}
              <Route path="/campaign-builder" element={
                <ProtectedRoute>
                  <Navigate to="/campaign-builder/step-1" replace />
                </ProtectedRoute>
              } />
              
              <Route path="/campaign-builder/step-:step" element={
                <ProtectedRoute>
                  <CampaignBuilder />
                </ProtectedRoute>
              } />
              
              {/* Legacy route redirect for campaigns/new */}
              <Route path="/campaigns/new" element={
                <ProtectedRoute>
                  <Navigate to="/campaign-builder/step-1" replace />
                </ProtectedRoute>
              } />
              
              <Route path="/campaigns/new/step-:step" element={
                <ProtectedRoute>
                  <Navigate to="/campaign-builder/step-1" replace />
                </ProtectedRoute>
              } />
              
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <CalendarOverview />
                </ProtectedRoute>
              } />
              
              <Route path="/qc-panel" element={
                <ProtectedRoute>
                  <QualityControlPanel />
                </ProtectedRoute>
              } />
              
              <Route path="/editor-dashboard" element={
                <ProtectedRoute>
                  <EditorView />
                </ProtectedRoute>
              } />
              
              <Route path="/billing" element={
                <ProtectedRoute>
                  <PaymentTiers />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
