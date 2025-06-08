
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Zap, MessageSquare, TrendingUp, DollarSign } from 'lucide-react';

interface BoostSettingsProps {
  echoPlatforms: number;
  autoFillLookalike: boolean;
  commentTemplates: string[];
  onEchoPlatformsChange: (value: number) => void;
  onAutoFillToggle: (enabled: boolean) => void;
  onCommentTemplatesChange: (templates: string[]) => void;
}

const BoostSettings = ({
  echoPlatforms,
  autoFillLookalike,
  commentTemplates,
  onEchoPlatformsChange,
  onAutoFillToggle,
  onCommentTemplatesChange
}: BoostSettingsProps) => {
  const [newComment, setNewComment] = useState('');

  const basePlatforms = 2; // Included in plan
  const extraPlatforms = Math.max(0, echoPlatforms - basePlatforms);
  const extraCost = extraPlatforms * 20;

  const addComment = () => {
    if (newComment.trim() && commentTemplates.length < 5) {
      onCommentTemplatesChange([...commentTemplates, newComment.trim()]);
      setNewComment('');
    }
  };

  const removeComment = (index: number) => {
    const updated = commentTemplates.filter((_, i) => i !== index);
    onCommentTemplatesChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Echo Boost Slider */}
      <Card className="frosted-glass bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Zap className="h-5 w-5 mr-2" />
            Echo Boost Platforms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/90">Platforms: {echoPlatforms}</span>
              <Badge className={extraCost > 0 ? 'bg-yellow-500/20 text-yellow-200' : 'bg-green-500/20 text-green-200'}>
                {extraCost > 0 ? `+$${extraCost}` : 'Included'}
              </Badge>
            </div>
            <Slider
              value={[echoPlatforms]}
              onValueChange={(value) => onEchoPlatformsChange(value[0])}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-white/60">
              <span>1 platform</span>
              <span>5 platforms</span>
            </div>
          </div>
          
          {extraCost > 0 && (
            <div className="glass-card-subtle p-3 rounded-lg">
              <div className="flex items-center text-yellow-400 mb-1">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="font-medium">Additional Cost</span>
              </div>
              <p className="text-white/80 text-sm">
                ${extraCost} for {extraPlatforms} extra platform{extraPlatforms !== 1 ? 's' : ''} beyond your plan limit
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comment Seeder */}
      <Card className="frosted-glass bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <MessageSquare className="h-5 w-5 mr-2" />
            Comment Seeding ({commentTemplates.length}/5)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {commentTemplates.map((comment, index) => (
              <div key={index} className="glass-card-subtle p-3 rounded-lg flex items-start justify-between">
                <p className="text-white/90 text-sm flex-1">{comment}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeComment(index)}
                  className="text-red-400 hover:text-red-300 ml-2"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>

          {commentTemplates.length < 5 && (
            <div className="space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a prewritten comment..."
                className="glass-card-subtle border-white/20 text-white placeholder:text-white/50 resize-none h-16"
              />
              <Button
                onClick={addComment}
                disabled={!newComment.trim()}
                className="glass-button-primary w-full"
              >
                Add Comment
              </Button>
            </div>
          )}

          <div className="text-white/60 text-sm">
            Add 3-5 engaging comments that will be randomly posted to boost initial engagement
          </div>
        </CardContent>
      </Card>

      {/* Auto-Fill Lookalike */}
      <Card className="frosted-glass bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <TrendingUp className="h-5 w-5 mr-2" />
            Auto-Fill Lookalike Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-white/90 font-medium">Enable Auto-Fill</p>
              <p className="text-white/60 text-sm">
                Automatically post trending-style content if you're inactive
              </p>
            </div>
            <Switch
              checked={autoFillLookalike}
              onCheckedChange={onAutoFillToggle}
            />
          </div>
          
          {autoFillLookalike && (
            <div className="glass-card-subtle p-3 rounded-lg">
              <p className="text-white/80 text-sm">
                ✨ When enabled, our AI will analyze trending content and create similar posts 
                to maintain your posting schedule when you're not active.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BoostSettings;
