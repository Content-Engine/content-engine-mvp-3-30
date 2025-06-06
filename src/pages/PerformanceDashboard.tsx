
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

const PerformanceDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/campaigns-dashboard')}
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-white">Performance Analytics</h1>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard campaignId="campaign-123" />
      </div>
    </div>
  );
};

export default PerformanceDashboard;
