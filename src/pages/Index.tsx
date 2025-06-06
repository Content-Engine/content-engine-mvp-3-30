
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Play, TrendingUp, BarChart3, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Viral Campaign Builder
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Create explosive short-form video campaigns across TikTok, Instagram Reels, YouTube Shorts, and Facebook
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Start New Campaign */}
          <Card className="bg-gradient-to-br from-pink-500 to-purple-600 border-0 hover:scale-105 transition-all duration-300 cursor-pointer group" 
                onClick={() => navigate('/campaign-builder/step-1')}>
            <CardContent className="p-8 text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Start Campaign</h3>
              <p className="text-white/80">Build viral content across all platforms</p>
            </CardContent>
          </Card>

          {/* Payment Tiers */}
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 hover:scale-105 transition-all duration-300 cursor-pointer group"
                onClick={() => navigate('/payment-tiers')}>
            <CardContent className="p-8 text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Upgrade Plan</h3>
              <p className="text-white/80">Scale your syndication power</p>
            </CardContent>
          </Card>

          {/* View Campaigns */}
          <Card className="bg-gradient-to-br from-orange-500 to-red-600 border-0 hover:scale-105 transition-all duration-300 cursor-pointer group"
                onClick={() => navigate('/campaigns-dashboard')}>
            <CardContent className="p-8 text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">My Campaigns</h3>
              <p className="text-white/80">Manage active campaigns</p>
            </CardContent>
          </Card>

          {/* Performance Dashboard */}
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 border-0 hover:scale-105 transition-all duration-300 cursor-pointer group"
                onClick={() => navigate('/performance-dashboard')}>
            <CardContent className="p-8 text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Analytics</h3>
              <p className="text-white/80">Track performance & ROI</p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { platform: "TikTok", color: "from-pink-500 to-purple-500", accounts: "30+ accounts" },
            { platform: "Instagram", color: "from-orange-500 to-pink-500", accounts: "25+ accounts" },
            { platform: "YouTube", color: "from-red-500 to-red-600", accounts: "20+ accounts" },
            { platform: "Facebook", color: "from-blue-500 to-blue-600", accounts: "15+ accounts" },
          ].map((item) => (
            <Card key={item.platform} className={`bg-gradient-to-br ${item.color} border-0`}>
              <CardContent className="p-4 text-center">
                <h4 className="text-lg font-bold text-white">{item.platform}</h4>
                <p className="text-white/80 text-sm">{item.accounts}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xl px-12 py-6 rounded-full font-bold shadow-2xl hover:scale-105 transition-all duration-300"
            onClick={() => navigate('/campaign-builder/step-1')}
          >
            <Zap className="mr-2 h-6 w-6" />
            Create Your First Viral Campaign
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
