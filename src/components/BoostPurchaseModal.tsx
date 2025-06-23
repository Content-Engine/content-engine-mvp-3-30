
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, DollarSign, TrendingUp, Users } from "lucide-react";
import { QCContent } from "@/types/qc";
import { useToast } from "@/hooks/use-toast";

interface BoostPurchaseModalProps {
  content: QCContent;
  isOpen: boolean;
  onClose: () => void;
}

const BOOST_TIERS = [
  {
    id: 'micro',
    name: 'Micro Boost',
    price: 15,
    reach: '5K - 15K',
    duration: '24 hours',
    features: ['Basic promotion', 'Standard targeting', 'Basic analytics'],
    icon: Zap,
    color: 'text-blue-400'
  },
  {
    id: 'standard',
    name: 'Standard Boost',
    price: 25,
    reach: '15K - 50K',
    duration: '48 hours',
    features: ['Enhanced promotion', 'Advanced targeting', 'Detailed analytics', 'Comment seeding'],
    icon: TrendingUp,
    color: 'text-orange-400',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium Boost',
    price: 50,
    reach: '50K - 150K',
    duration: '72 hours',
    features: ['Maximum promotion', 'Premium targeting', 'Full analytics suite', 'Comment seeding', 'Influencer outreach'],
    icon: Users,
    color: 'text-purple-400'
  }
];

const BoostPurchaseModal = ({ content, isOpen, onClose }: BoostPurchaseModalProps) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handlePurchase = async () => {
    if (!selectedTier) return;
    
    try {
      setProcessing(true);
      
      // Simulate boost purchase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const tier = BOOST_TIERS.find(t => t.id === selectedTier);
      
      toast({
        title: "Boost Purchased!",
        description: `${tier?.name} has been activated for "${content.title}". Your content will start receiving enhanced promotion within 15 minutes.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase boost. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-400" />
            Boost Content: {content.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              Amplify your content's reach with our boost packages. Get more views, engagement, and visibility across platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BOOST_TIERS.map((tier) => {
              const Icon = tier.icon;
              const isSelected = selectedTier === tier.id;
              
              return (
                <Card 
                  key={tier.id}
                  className={`cursor-pointer transition-all duration-200 relative ${
                    isSelected 
                      ? 'border-orange-500 bg-orange-500/10' 
                      : 'hover:border-orange-300 hover:bg-orange-500/5'
                  }`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white">
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <Icon className={`h-8 w-8 mx-auto mb-2 ${tier.color}`} />
                      <h3 className="font-bold text-lg">{tier.name}</h3>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-2xl font-bold">{tier.price}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>{tier.reach} reach</p>
                        <p>{tier.duration}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <div key={index} className="text-sm flex items-center justify-center gap-2">
                          <div className="w-1 h-1 bg-current rounded-full" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {selectedTier && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Your boost will be processed within 15 minutes of purchase. 
                You'll receive analytics updates as your content gains traction.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={onClose} disabled={processing}>
                  Cancel
                </Button>
                <Button 
                  onClick={handlePurchase} 
                  disabled={processing}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {processing ? "Processing..." : `Purchase ${BOOST_TIERS.find(t => t.id === selectedTier)?.name}`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoostPurchaseModal;
