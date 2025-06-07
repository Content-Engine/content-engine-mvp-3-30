
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CampaignBuilderStep2Props {
  campaignData: any;
  updateCampaignData: (updates: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CampaignBuilderStep2 = ({ campaignData, updateCampaignData, onNext }: CampaignBuilderStep2Props) => {
  return (
    <div className="space-y-8">
      {/* Step Title */}
      <div className="text-center">
        <div className="glass-card-strong p-8 mb-6 inline-block">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Upload Content 📁
          </h2>
          <div className="h-1 w-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full"></div>
        </div>
        <p className="text-lg text-white/90 glass-card-strong p-4 inline-block">
          Upload 1-3 video or image files for your campaign
        </p>
      </div>

      {/* Upload Area */}
      <Card className="frosted-glass bg-gradient-to-br from-gray-500/80 to-gray-600/80 border-0 max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="border-2 border-dashed border-white/30 rounded-lg p-12 hover:border-white/50 transition-colors cursor-pointer">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Drop files here or click to browse
            </h3>
            <p className="text-white/80 mb-6">
              Supports MP4, MOV, JPG, PNG (Max 3 files)
            </p>
            <Button className="glass-button-primary">
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="text-center">
        <Button onClick={onNext} size="lg" className="glass-button-primary">
          Continue to Syndication
        </Button>
      </div>
    </div>
  );
};

export default CampaignBuilderStep2;
