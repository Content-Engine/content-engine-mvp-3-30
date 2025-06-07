
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Clock, 
  TrendingUp,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Pause
} from "lucide-react";

interface EditorsPanelProps {
  currentCampaign: string;
}

interface Editor {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'idle' | 'blocked';
  currentTasks: number;
  uploadSpeed: number; // clips per day
  assignedCampaigns: string[];
  discordHandle: string;
  completionRate: number;
  totalCompleted: number;
}

const EditorsPanel = ({ currentCampaign }: EditorsPanelProps) => {
  const [selectedEditor, setSelectedEditor] = useState<Editor | null>(null);

  // Mock data - replace with real data fetching
  const editors: Editor[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@contentengine.com',
      status: 'online',
      currentTasks: 5,
      uploadSpeed: 12,
      assignedCampaigns: ['Summer Boost', 'Product Launch'],
      discordHandle: '@sarah_editor',
      completionRate: 94,
      totalCompleted: 247
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@contentengine.com',
      status: 'idle',
      currentTasks: 3,
      uploadSpeed: 8,
      assignedCampaigns: ['Product Launch'],
      discordHandle: '@mike_creative',
      completionRate: 89,
      totalCompleted: 156
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma@contentengine.com',
      status: 'online',
      currentTasks: 7,
      uploadSpeed: 15,
      assignedCampaigns: ['Summer Boost', 'Brand Awareness'],
      discordHandle: '@emma_designs',
      completionRate: 97,
      totalCompleted: 312
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500/20 text-green-400';
      case 'idle': return 'bg-yellow-500/20 text-yellow-400';
      case 'blocked': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4" />;
      case 'idle': return <Pause className="h-4 w-4" />;
      case 'blocked': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-black/30 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Total Editors</CardTitle>
            <Users className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{editors.length}</div>
            <p className="text-xs text-white/50">Active team members</p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Online Now</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {editors.filter(e => e.status === 'online').length}
            </div>
            <p className="text-xs text-white/50">Currently working</p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {editors.reduce((sum, editor) => sum + editor.currentTasks, 0)}
            </div>
            <p className="text-xs text-white/50">In progress</p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Avg. Speed</CardTitle>
            <TrendingUp className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {Math.round(editors.reduce((sum, editor) => sum + editor.uploadSpeed, 0) / editors.length)}
            </div>
            <p className="text-xs text-white/50">clips/day</p>
          </CardContent>
        </Card>
      </div>

      {/* Editors Table */}
      <Card className="bg-black/30 backdrop-blur-lg border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Editor Management
            </CardTitle>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Editor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/70">Editor</TableHead>
                <TableHead className="text-white/70">Status</TableHead>
                <TableHead className="text-white/70">Current Tasks</TableHead>
                <TableHead className="text-white/70">Speed</TableHead>
                <TableHead className="text-white/70">Completion Rate</TableHead>
                <TableHead className="text-white/70">Campaigns</TableHead>
                <TableHead className="text-white/70">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editors.map((editor) => (
                <TableRow key={editor.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{editor.name}</div>
                      <div className="text-sm text-white/50">{editor.email}</div>
                      <div className="text-xs text-white/40 flex items-center gap-1 mt-1">
                        <MessageSquare className="h-3 w-3" />
                        {editor.discordHandle}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(editor.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(editor.status)}
                        {editor.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-white">{editor.currentTasks}</div>
                    <div className="text-xs text-white/50">{editor.totalCompleted} total</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-white">{editor.uploadSpeed}</div>
                    <div className="text-xs text-white/50">clips/day</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-white">{editor.completionRate}%</div>
                    <div className="w-full bg-white/10 rounded-full h-1 mt-1">
                      <div 
                        className="bg-green-400 h-1 rounded-full" 
                        style={{ width: `${editor.completionRate}%` }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {editor.assignedCampaigns.map((campaign) => (
                        <Badge key={campaign} variant="outline" className="text-xs text-white/70 border-white/20">
                          {campaign}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-white border-white/20"
                        onClick={() => setSelectedEditor(editor)}
                      >
                        View Details
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Editor Details Modal/Panel */}
      {selectedEditor && (
        <Card className="bg-black/30 backdrop-blur-lg border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">
                {selectedEditor.name} - Detailed View
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedEditor(null)}
                className="text-white/70 hover:text-white"
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Completion Rate</span>
                    <span className="text-white">{selectedEditor.completionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Total Completed</span>
                    <span className="text-white">{selectedEditor.totalCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Upload Speed</span>
                    <span className="text-white">{selectedEditor.uploadSpeed} clips/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Current Tasks</span>
                    <span className="text-white">{selectedEditor.currentTasks}</span>
                  </div>
                </div>
              </div>

              {/* Assignment Actions */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">Quick Actions</h4>
                <div className="space-y-2">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Assign New Content
                  </Button>
                  <Button variant="outline" className="w-full text-white border-white/20">
                    View Task History
                  </Button>
                  <Button variant="outline" className="w-full text-white border-white/20">
                    Message on Discord
                  </Button>
                  <Button variant="outline" className="w-full text-white border-white/20">
                    Reassign Current Tasks
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EditorsPanel;
