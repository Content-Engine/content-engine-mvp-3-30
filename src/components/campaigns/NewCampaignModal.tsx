
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface CampaignFormData {
  name: string;
  assigned_editor_id: string;
  platforms: string[];
  clips_count: number;
  cta_type: string;
  posting_start_date: string;
  posting_end_date: string;
  echo_boost_enabled: boolean;
  requires_approval: boolean;
  notes: string;
}

const NewCampaignModal = ({ isOpen, onClose, onSubmit }: NewCampaignModalProps) => {
  const [formData, setFormData] = useState<CampaignFormData>({
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

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      platforms: checked 
        ? [...prev.platforms, platformId]
        : prev.platforms.filter(p => p !== platformId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      alert('Campaign name is required');
      return;
    }
    
    if (formData.platforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      
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
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card-bg border-border-color max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-text-main text-xl font-semibold">
            Create New Campaign
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-text-muted hover:text-text-main"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Name */}
          <div>
            <Label htmlFor="name" className="label-primary">
              Campaign Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter campaign name"
              className="input-primary"
              required
            />
          </div>

          {/* Platforms */}
          <div>
            <Label className="label-primary">Platforms *</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.id}
                    checked={formData.platforms.includes(platform.id)}
                    onCheckedChange={(checked) => handlePlatformChange(platform.id, checked as boolean)}
                  />
                  <Label htmlFor={platform.id} className="text-text-main">
                    {platform.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Clips Count */}
          <div>
            <Label htmlFor="clips_count" className="label-primary">
              Number of Clips
            </Label>
            <Input
              id="clips_count"
              type="number"
              min="1"
              max="100"
              value={formData.clips_count}
              onChange={(e) => setFormData(prev => ({ ...prev, clips_count: parseInt(e.target.value) || 1 }))}
              className="input-primary"
            />
          </div>

          {/* CTA Type */}
          <div>
            <Label htmlFor="cta_type" className="label-primary">
              CTA Type
            </Label>
            <select
              id="cta_type"
              value={formData.cta_type}
              onChange={(e) => setFormData(prev => ({ ...prev, cta_type: e.target.value }))}
              className="input-primary"
            >
              {ctaTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Posting Window */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date" className="label-primary">
                Start Date
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.posting_start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, posting_start_date: e.target.value }))}
                className="input-primary"
              />
            </div>
            <div>
              <Label htmlFor="end_date" className="label-primary">
                End Date
              </Label>
              <Input
                id="end_date"
                type="date"
                value={formData.posting_end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, posting_end_date: e.target.value }))}
                className="input-primary"
              />
            </div>
          </div>

          {/* Toggle Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="echo_boost" className="text-text-main">
                Enable Echo Boost
              </Label>
              <Checkbox
                id="echo_boost"
                checked={formData.echo_boost_enabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, echo_boost_enabled: checked as boolean }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="requires_approval" className="text-text-main">
                Requires Approval
              </Label>
              <Checkbox
                id="requires_approval"
                checked={formData.requires_approval}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requires_approval: checked as boolean }))}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="label-primary">
              Campaign Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes or instructions..."
              className="input-primary min-h-[100px] resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="btn-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewCampaignModal;
