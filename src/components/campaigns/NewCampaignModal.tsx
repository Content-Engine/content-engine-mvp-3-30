
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { X, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaignData: any) => Promise<void>;
}

const NewCampaignModal = ({ isOpen, onClose, onSubmit }: NewCampaignModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    assigned_editor_id: '',
    platforms: [] as string[],
    clips_count: 1,
    cta_type: 'awareness',
    posting_start_date: '',
    posting_end_date: '',
    echo_boost_enabled: false,
    requires_approval: true,
    notes: ''
  });

  const platforms = [
    { id: 'tiktok', label: 'TikTok' },
    { id: 'instagram', label: 'Instagram Reels' },
    { id: 'youtube', label: 'YouTube Shorts' },
    { id: 'threads', label: 'Threads' }
  ];

  const ctaTypes = [
    { value: 'awareness', label: 'Awareness' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'conversion', label: 'Conversion' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        user_id: user?.id,
        status: 'draft'
      });
      
      // Reset form
      setFormData({
        name: '',
        assigned_editor_id: '',
        platforms: [],
        clips_count: 1,
        cta_type: 'awareness',
        posting_start_date: '',
        posting_end_date: '',
        echo_boost_enabled: false,
        requires_approval: true,
        notes: ''
      });
    } catch (error) {
      console.error('Failed to create campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        platforms: [...prev.platforms, platform]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        platforms: prev.platforms.filter(p => p !== platform)
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-main">Create New Campaign</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-text-muted hover:text-text-main"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campaign Name */}
            <div>
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter campaign name"
                required
                className="mt-1"
              />
            </div>

            {/* Platforms */}
            <div>
              <Label>Platforms *</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {platforms.map((platform) => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform.id}
                      checked={formData.platforms.includes(platform.id)}
                      onCheckedChange={(checked) => 
                        handlePlatformChange(platform.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={platform.id} className="text-sm">
                      {platform.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Clips Count */}
            <div>
              <Label htmlFor="clips_count">Number of Clips</Label>
              <Input
                id="clips_count"
                type="number"
                min="1"
                value={formData.clips_count}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  clips_count: parseInt(e.target.value) || 1 
                }))}
                className="mt-1"
              />
            </div>

            {/* CTA Type */}
            <div>
              <Label htmlFor="cta_type">CTA Focus</Label>
              <select
                id="cta_type"
                value={formData.cta_type}
                onChange={(e) => setFormData(prev => ({ ...prev, cta_type: e.target.value }))}
                className="mt-1 w-full px-3 py-2 bg-card-bg border border-border-color rounded-xl text-text-main"
              >
                {ctaTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Posting Window */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="posting_start_date">Start Date</Label>
                <Input
                  id="posting_start_date"
                  type="date"
                  value={formData.posting_start_date}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    posting_start_date: e.target.value 
                  }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="posting_end_date">End Date</Label>
                <Input
                  id="posting_end_date"
                  type="date"
                  value={formData.posting_end_date}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    posting_end_date: e.target.value 
                  }))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="echo_boost">Echo Boost</Label>
                <Switch
                  id="echo_boost"
                  checked={formData.echo_boost_enabled}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, echo_boost_enabled: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="requires_approval">Requires Approval</Label>
                <Switch
                  id="requires_approval"
                  checked={formData.requires_approval}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, requires_approval: checked }))
                  }
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Campaign Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes or requirements..."
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.name || formData.platforms.length === 0}
                className="flex-1 bg-accent hover:bg-hover-accent text-white"
              >
                {loading ? 'Creating...' : 'Create Campaign'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewCampaignModal;
