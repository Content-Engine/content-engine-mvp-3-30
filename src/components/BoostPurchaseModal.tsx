import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Zap, TrendingUp, Users, Clock } from "lucide-react";
import { QCContent } from "@/types/qc";
import { useToast } from "@/hooks/use-toast";

interface BoostPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: QCContent;
}

const BoostPurchaseModal = ({ isOpen, onClose, content }: BoostPurchaseModalProps) => {
  const [selectedTier, setSelectedTier] = useState<'micro' | 'standard' | 'premium' | null>(null);
  const [autoBoost, setAutoBoost] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const boostTiers = [
    {
      id: 'micro' as const,
      name: 'Micro Boost',
      price: 10,
      reach: '5k–10k',
      description: 'Perfect for testing content performance',
      icon: '⚡',
      features: ['5k-10k estimated reach', '24-48h delivery', 'Basic analytics']
    },
    {
      id: 'standard' as const,
      name: 'Standard Boost',
      price: 25,
      reach: '10k–25k',
      description: 'Great for solid engagement and visibility',
      icon: '🚀',
      features: ['10k-25k estimated reach', '12-24h delivery', 'Detailed analytics', 'Platform optimization']
    },
    {
      id: 'premium' as const,
      name: 'Premium Boost',
      price: 50,
      reach: '25k–60k',
      description: 'Maximum reach and premium placement',
      icon: '🔥',
      features: ['25k-60k estimated reach', '6-12h delivery', 'Advanced analytics', 'Priority placement', 'Engagement optimization']
    }
  ];

  const handlePurchase = async () => {
    if (!selectedTier) return;

    setIsProcessing(true);
    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Boost Purchased!",
        description: `${boostTiers.find(t => t.id === selectedTier)?.name} has been applied to your content.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedTierData = boostTiers.find(t => t.id === selectedTier);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-orange-500" />
            Boost This Content
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Content Preview */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <img 
                src={content.thumbnailUrl} 
                alt="Content preview"
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h4 className="font-medium">{content.title}</h4>
                <p className="text-sm text-muted-foreground">{content.accountName} • {content.platform}</p>
              </div>
            </div>
          </div>

          {/* Boost Tier Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Choose Your Boost Level</h3>
            <div className="grid gap-3">
              {boostTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTier === tier.id 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{tier.icon}</span>
                      <div>
                        <h4 className="font-semibold">{tier.name}</h4>
                        <p className="text-sm text-muted-foreground">{tier.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">${tier.price}</div>
                      <div className="text-sm text-muted-foreground">{tier.reach} reach</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Auto Boost Toggle */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <h4 className="font-medium">Run boost automatically on publish</h4>
              <p className="text-sm text-muted-foreground">
                Automatically apply this boost level when content goes live
              </p>
            </div>
            <Switch
              checked={autoBoost}
              onCheckedChange={setAutoBoost}
            />
          </div>

          {/* Estimated Results */}
          {selectedTierData && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Estimated Results
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-lg font-bold">
                    <Users className="h-4 w-4" />
                    {selectedTierData.reach}
                  </div>
                  <div className="text-xs text-muted-foreground">Estimated Reach</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-lg font-bold">
                    <Clock className="h-4 w-4" />
                    {selectedTierData.features[1].split(' ')[0]}
                  </div>
                  <div className="text-xs text-muted-foreground">Delivery Time</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{content.platform}</div>
                  <div className="text-xs text-muted-foreground">Platform</div>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Button */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={!selectedTier || isProcessing}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              {isProcessing ? (
                "Processing..."
              ) : selectedTierData ? (
                `Purchase ${selectedTierData.name} - $${selectedTierData.price}`
              ) : (
                "Select a boost level"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoostPurchaseModal;
