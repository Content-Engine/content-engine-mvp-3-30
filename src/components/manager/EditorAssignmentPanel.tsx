
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useEditorAssignments } from "@/hooks/useEditorAssignments";
import { useIncomingContent } from "@/hooks/useIncomingContent";
import { User, Calendar, FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const EditorAssignmentPanel = () => {
  const { assignments, loading, updateAssignment, createAssignment } = useEditorAssignments();
  const { submissions } = useIncomingContent();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'submitted': return <FileText className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'assigned': return <User className="h-4 w-4" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = async (assignmentId: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      if (newStatus === 'submitted') {
        updates.completed_at = new Date().toISOString();
      }
      
      await updateAssignment(assignmentId, updates);
      toast({
        title: "Success",
        description: "Assignment status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update assignment status",
        variant: "destructive",
      });
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (statusFilter === 'all') return true;
    return assignment.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <div className="h-8 loading-skeleton w-48 mb-4 mx-auto"></div>
          <div className="h-4 loading-skeleton w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Assignment Actions */}
      <div className="flex flex-wrap gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignments</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assignments List */}
      <div className="grid gap-4">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(assignment.status)}
                    <h3 className="font-semibold text-lg">
                      {assignment.content_item?.file_name || 'Content Assignment'}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {assignment.editor?.name || 'Unassigned'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Assigned: {assignment.assigned_at ? new Date(assignment.assigned_at).toLocaleDateString() : 'N/A'}
                    </div>
                    {assignment.content_item?.campaign?.name && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Campaign: {assignment.content_item.campaign.name}
                      </div>
                    )}
                  </div>

                  {assignment.notes && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Notes: {assignment.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(assignment.status)}>
                    {assignment.status.replace('_', ' ')}
                  </Badge>
                  
                  <Select
                    value={assignment.status}
                    onValueChange={(value) => handleStatusUpdate(assignment.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Assignments Found</h3>
            <p className="text-muted-foreground">
              {statusFilter === 'all' 
                ? 'No editor assignments available at the moment.' 
                : `No assignments with status "${statusFilter}".`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignments.filter(a => a.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignments.filter(a => a.status === 'submitted').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignments.filter(a => a.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditorAssignmentPanel;
