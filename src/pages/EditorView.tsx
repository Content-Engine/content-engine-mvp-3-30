
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, FileText, Calendar, CheckSquare, Clock, User, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEditorAssignments } from "@/hooks/useEditorAssignments";
import Layout from "@/components/Layout";
import NotificationButton from "@/components/NotificationButton";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const EditorView = () => {
  const { assignments, loading, updateAssignment, error } = useEditorAssignments();
  const { toast } = useToast();
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [hasCheckedAccess, setHasCheckedAccess] = useState(false);

  console.log('EditorView: Current state', { 
    user: !!user, 
    userRole, 
    authLoading, 
    assignmentsLoading: loading,
    assignmentsCount: assignments.length,
    error 
  });

  // Check access permissions
  useEffect(() => {
    if (!authLoading && !hasCheckedAccess) {
      setHasCheckedAccess(true);
      
      if (!user) {
        console.log('EditorView: No user, redirecting to auth');
        navigate('/auth');
        return;
      }
      
      if (userRole && !['admin', 'editor'].includes(userRole)) {
        console.log('EditorView: Invalid role for editor access:', userRole);
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the Editor Portal.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }
    }
  }, [authLoading, hasCheckedAccess, user, userRole, navigate, toast]);

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
      console.error('Error updating assignment status:', error);
      toast({
        title: "Error",
        description: "Failed to update assignment status",
        variant: "destructive",
      });
    }
  };

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

  // Show loading while checking auth
  if (authLoading || !hasCheckedAccess) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 loading-skeleton w-48 mb-4 mx-auto"></div>
              <div className="h-4 loading-skeleton w-32 mx-auto"></div>
            </div>
            <p className="text-muted-foreground mt-4">Checking access permissions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error if access check failed
  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">Please log in to access the Editor Portal.</p>
            <Button onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700">
              Go to Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error if user doesn't have editor access
  if (userRole && !['admin', 'editor'].includes(userRole)) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">You don't have permission to access the Editor Portal.</p>
            <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error if there was a data fetching error
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Editor Portal</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Show loading while fetching assignments
  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-pulse">
            <div className="h-8 loading-skeleton w-48 mb-4 mx-auto"></div>
            <div className="h-4 loading-skeleton w-32 mx-auto"></div>
          </div>
          <p className="text-muted-foreground mt-4">Loading assignments...</p>
        </div>
      </Layout>
    );
  }

  const pendingAssignments = assignments.filter(a => a.status === 'assigned');
  const inProgressAssignments = assignments.filter(a => a.status === 'in_progress');
  const completedAssignments = assignments.filter(a => a.status === 'approved');

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Editor Dashboard
            </h1>
            <p className="text-muted-foreground">
              Content editing and assignment management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationButton />
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Editor Access
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAssignments.length}</div>
              <p className="text-xs text-muted-foreground">Assignments awaiting work</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressAssignments.length}</div>
              <p className="text-xs text-muted-foreground">Currently working on</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAssignments.length}</div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              My Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No assignments available at the moment.</p>
                <p className="text-sm text-muted-foreground">Check back later for new editing tasks.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <h3 className="font-semibold">
                            {assignment.content_item?.file_name || 'Content Assignment'}
                          </h3>
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Assigned: {assignment.assigned_at ? new Date(assignment.assigned_at).toLocaleDateString() : 'N/A'}
                          </div>
                          {assignment.content_item?.campaign?.name && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              Campaign: {assignment.content_item.campaign.name}
                            </div>
                          )}
                        </div>

                        {assignment.notes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Notes: {assignment.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
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
                            <SelectItem value="submitted">Submit for Review</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditorView;
