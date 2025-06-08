
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, TrendingUp, Youtube, Instagram, AtSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/hooks/useAuth';

interface Campaign {
  id: string;
  name: string;
  assigned_editor_id?: string;
  posting_start_date?: string;
  posting_end_date?: string;
  platforms?: string[];
  cta_type?: string;
  echo_boost_enabled?: boolean;
  status?: string;
  created_at: string;
}

interface CampaignsTableProps {
  campaigns: Campaign[];
  loading: boolean;
  userRole: UserRole | null;
}

const CampaignsTable = ({ campaigns, loading, userRole }: CampaignsTableProps) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    const aValue = a[sortField as keyof Campaign] || '';
    const bValue = b[sortField as keyof Campaign] || '';
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return <TrendingUp className="h-4 w-4" />; // Using TrendingUp as substitute for TikTok
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'threads':
        return <AtSign className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'draft':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-card-bg rounded-xl p-8 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-border-color rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-border-color rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="bg-card-bg rounded-xl p-8 text-center">
        <h3 className="text-lg font-semibold text-text-main mb-2">No campaigns found</h3>
        <p className="text-text-muted">Create your first campaign to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-card-bg rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border-color">
            <tr>
              <th 
                className="text-left p-4 cursor-pointer hover:bg-border-color/50 transition-colors"
                onClick={() => handleSort('name')}
              >
                <span className="text-text-main font-semibold">Campaign Name</span>
              </th>
              <th className="text-left p-4">
                <span className="text-text-main font-semibold">Editor</span>
              </th>
              <th 
                className="text-left p-4 cursor-pointer hover:bg-border-color/50 transition-colors"
                onClick={() => handleSort('posting_start_date')}
              >
                <span className="text-text-main font-semibold">Dates</span>
              </th>
              <th className="text-left p-4">
                <span className="text-text-main font-semibold">Platforms</span>
              </th>
              <th className="text-left p-4">
                <span className="text-text-main font-semibold">CTA</span>
              </th>
              <th className="text-left p-4">
                <span className="text-text-main font-semibold">Boost</span>
              </th>
              <th className="text-left p-4">
                <span className="text-text-main font-semibold">Status</span>
              </th>
              <th className="text-left p-4">
                <span className="text-text-main font-semibold">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCampaigns.map((campaign) => (
              <tr 
                key={campaign.id} 
                className="border-b border-border-color hover:bg-border-color/30 transition-colors"
              >
                <td className="p-4">
                  <div className="font-medium text-text-main">{campaign.name}</div>
                </td>
                <td className="p-4">
                  <div className="text-text-muted">
                    {campaign.assigned_editor_id ? 'Assigned' : 'Unassigned'}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <div className="text-text-main">{formatDate(campaign.posting_start_date)}</div>
                    <div className="text-text-muted">→ {formatDate(campaign.posting_end_date)}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {campaign.platforms?.map((platform) => (
                      <div
                        key={platform}
                        className="flex items-center justify-center w-8 h-8 bg-accent/20 rounded-lg text-accent"
                        title={platform}
                      >
                        {getPlatformIcon(platform)}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className="text-text-muted">
                    {campaign.cta_type || 'Awareness'}
                  </Badge>
                </td>
                <td className="p-4">
                  {campaign.echo_boost_enabled ? (
                    <Badge className="bg-accent/20 text-accent border-accent/30">
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-text-muted">
                      Disabled
                    </Badge>
                  )}
                </td>
                <td className="p-4">
                  <Badge className={getStatusColor(campaign.status || 'draft')}>
                    {campaign.status || 'Draft'}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/campaigns/${campaign.id}`)}
                      className="text-text-muted hover:text-text-main"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(userRole === 'admin' || userRole === 'social_media_manager') && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-text-muted hover:text-text-main"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-text-muted hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignsTable;
