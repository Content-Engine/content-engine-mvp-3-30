
import { useState } from 'react';
import { ChevronDown, Plus, Search, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Campaign {
  id: string;
  name: string;
  goal?: string;
  status?: string;
  created_at: string;
}

interface CampaignAssignmentProps {
  campaigns: Campaign[];
  selectedCampaign: string | null;
  onCampaignSelect: (campaignId: string) => void;
  onAssign: (campaignId: string) => void;
  loading: boolean;
}

const CampaignAssignment = ({ 
  campaigns, 
  selectedCampaign, 
  onCampaignSelect, 
  onAssign, 
  loading 
}: CampaignAssignmentProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCampaignData = campaigns.find(c => c.id === selectedCampaign);

  const handleAssign = () => {
    if (selectedCampaign) {
      onAssign(selectedCampaign);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Target className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-semibold text-slate-50">Assign to Campaign</h3>
      </div>

      {/* Campaign Selection */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-xl px-4 py-3 text-left text-slate-50 hover:bg-slate-700/50 transition-colors flex items-center justify-between"
        >
          <span>
            {selectedCampaignData ? selectedCampaignData.name : 'Select a campaign...'}
          </span>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/90 backdrop-blur-xl border border-slate-600/30 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            {/* Search */}
            <div className="p-3 border-b border-slate-600/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/30 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Campaigns List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign) => (
                  <button
                    key={campaign.id}
                    onClick={() => {
                      onCampaignSelect(campaign.id);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-slate-50 font-medium">{campaign.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {campaign.goal && (
                            <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                              {campaign.goal}
                            </span>
                          )}
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(campaign.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {selectedCampaign === campaign.id && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400">
                  No campaigns found
                </div>
              )}
            </div>

            {/* Create New Campaign */}
            <div className="p-3 border-t border-slate-600/30">
              <button className="w-full bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-lg px-4 py-2 text-blue-400 hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Create New Campaign
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Selected Campaign Info */}
      {selectedCampaignData && (
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/20 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2">
          <h4 className="text-slate-300 font-medium mb-2">Selected Campaign</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-50 font-medium">{selectedCampaignData.name}</p>
              <div className="flex items-center gap-2 mt-1">
                {selectedCampaignData.goal && (
                  <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                    Goal: {selectedCampaignData.goal}
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  Status: {selectedCampaignData.status || 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Button */}
      <Button
        onClick={handleAssign}
        disabled={!selectedCampaign || loading}
        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white border border-emerald-500/50 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-lg font-medium"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Assigning Content...
          </span>
        ) : (
          'Assign Content to Campaign'
        )}
      </Button>
    </div>
  );
};

export default CampaignAssignment;
