import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, UserCheck, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Editor {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'busy' | 'offline';
  current_task_count: number;
  upload_speed_per_day: number;
}

const EditorAssignmentPanel = () => {
  const { toast } = useToast();
  const [editors, setEditors] = useState<Editor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEditor, setSelectedEditor] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<string>("");

  // Mock task data
  const pendingTasks = [
    { id: "1", title: "Morning Workout Video", campaign: "Fitness Q1", priority: "high", deadline: "2024-01-20" },
    { id: "2", title: "Recipe Tutorial", campaign: "Food Content", priority: "medium", deadline: "2024-01-21" },
    { id: "3", title: "Product Review", campaign: "Tech Reviews", priority: "low", deadline: "2024-01-22" },
    { id: "4", title: "Behind the Scenes", campaign: "Brand Story", priority: "high", deadline: "2024-01-20" },
  ];

  useEffect(() => {
    fetchEditors();
  }, []);

  const fetchEditors = async () => {
    try {
      const { data, error } = await supabase
        .from('editors')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching editors:', error);
        // Use mock data if database is empty
        setEditors([
          { id: "1", name: "Sarah K.", email: "sarah@example.com", status: "online", current_task_count: 3, upload_speed_per_day: 8.5 },
          { id: "2", name: "Mike D.", email: "mike@example.com", status: "busy", current_task_count: 5, upload_speed_per_day: 7.2 },
          { id: "3", name: "Alex R.", email: "alex@example.com", status: "offline", current_task_count: 2, upload_speed_per_day: 6.8 },
          { id: "4", name: "Emma L.", email: "emma@example.com", status: "online", current_task_count: 4, upload_speed_per_day: 9.1 },
        ]);
      } else {
        // Type-safe conversion of database response to Editor interface
        const VALID_STATUSES = ["online", "busy", "offline"] as const;
        
        const parsedEditors: Editor[] = (data || []).map((editor: any) => ({
          id: editor.id,
          name: editor.name,
          email: editor.email,
          status: VALID_STATUSES.includes(editor.status as Editor["status"])
            ? (editor.status as Editor["status"])
            : "offline", // fallback to offline for invalid statuses
          current_task_count: editor.current_task_count || 0,
          upload_speed_per_day: editor.upload_speed_per_day || 0,
        }));
        
        setEditors(parsedEditors);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch editors",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "busy": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      online: "bg-green-100 text-green-800",
      busy: "bg-yellow-100 text-yellow-800",
      offline: "bg-gray-100 text-gray-800"
    };
    return colors[status as keyof typeof colors] || colors.offline;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const handleTaskAssignment = () => {
    if (!selectedEditor || !selectedTask) {
      toast({
        title: "Error",
        description: "Please select both an editor and a task",
        variant: "destructive",
      });
      return;
    }

    const editor = editors.find(e => e.id === selectedEditor);
    const task = pendingTasks.find(t => t.id === selectedTask);

    toast({
      title: "Task Assigned",
      description: `Assigned "${task?.title}" to ${editor?.name}`,
    });

    // Reset selections
    setSelectedEditor("");
    setSelectedTask("");
  };

  const getWorkloadColor = (taskCount: number) => {
    if (taskCount <= 2) return "text-green-600";
    if (taskCount <= 4) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading editors...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Editor Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {editors.map((editor) => (
          <Card key={editor.id} className="relative">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {editor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{editor.name}</p>
                    <p className="text-xs text-muted-foreground">{editor.email}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(editor.status)}`} />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant="outline" className={getStatusBadge(editor.status)}>
                    {editor.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Current Tasks:</span>
                  <span className={`font-medium ${getWorkloadColor(editor.current_task_count)}`}>
                    {editor.current_task_count}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Upload Speed:</span>
                  <span className="font-medium">{editor.upload_speed_per_day}/day</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    View Tasks
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Assignment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Task Reassignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Select value={selectedTask} onValueChange={setSelectedTask}>
              <SelectTrigger>
                <SelectValue placeholder="Select Task" />
              </SelectTrigger>
              <SelectContent>
                {pendingTasks.map(task => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title} - {task.campaign}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedEditor} onValueChange={setSelectedEditor}>
              <SelectTrigger>
                <SelectValue placeholder="Assign to Editor" />
              </SelectTrigger>
              <SelectContent>
                {editors.filter(e => e.status !== 'offline').map(editor => (
                  <SelectItem key={editor.id} value={editor.id}>
                    {editor.name} ({editor.current_task_count} tasks)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleTaskAssignment} className="w-full">
              Assign Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Task Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{task.title}</p>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{task.campaign}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Due: {task.deadline}</p>
                  <Button size="sm" variant="outline" className="mt-1">
                    Assign
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Editors Online</p>
                <p className="text-2xl font-bold text-green-600">
                  {editors.filter(e => e.status === 'online').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">
                  {editors.reduce((sum, e) => sum + e.current_task_count, 0)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Upload Speed</p>
                <p className="text-2xl font-bold">
                  {(editors.reduce((sum, e) => sum + e.upload_speed_per_day, 0) / editors.length).toFixed(1)}/day
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditorAssignmentPanel;
