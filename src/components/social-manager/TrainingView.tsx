
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap,
  Play,
  CheckCircle,
  Clock,
  Users,
  BookOpen,
  Video,
  FileText
} from "lucide-react";

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz';
  duration: string;
  role: 'scheduler' | 'editor' | 'social_manager' | 'all';
  completed: boolean;
  progress: number;
  url?: string;
}

const TrainingView = () => {
  const [selectedRole, setSelectedRole] = useState<'all' | 'scheduler' | 'editor' | 'social_manager'>('all');

  // Mock data - replace with real data fetching
  const trainingModules: TrainingModule[] = [
    {
      id: '1',
      title: 'Content Scheduling Fundamentals',
      description: 'Learn the basics of scheduling content across multiple platforms',
      type: 'video',
      duration: '15 min',
      role: 'scheduler',
      completed: true,
      progress: 100,
      url: 'https://loom.com/example'
    },
    {
      id: '2',
      title: 'Video Editing Best Practices',
      description: 'Master the art of creating engaging short-form content',
      type: 'video',
      duration: '25 min',
      role: 'editor',
      completed: false,
      progress: 60,
      url: 'https://youtube.com/example'
    },
    {
      id: '3',
      title: 'Platform-Specific Guidelines',
      description: 'Understand the unique requirements for each social platform',
      type: 'document',
      duration: '10 min',
      role: 'all',
      completed: true,
      progress: 100
    },
    {
      id: '4',
      title: 'Analytics & Performance Tracking',
      description: 'Learn how to analyze content performance and optimize campaigns',
      type: 'video',
      duration: '20 min',
      role: 'social_manager',
      completed: false,
      progress: 0
    },
    {
      id: '5',
      title: 'Quality Control Standards',
      description: 'Comprehensive guide to maintaining content quality',
      type: 'document',
      duration: '8 min',
      role: 'all',
      completed: true,
      progress: 100
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'quiz': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-purple-500/20 text-purple-400';
      case 'document': return 'bg-blue-500/20 text-blue-400';
      case 'quiz': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'scheduler': return 'bg-yellow-500/20 text-yellow-400';
      case 'editor': return 'bg-purple-500/20 text-purple-400';
      case 'social_manager': return 'bg-green-500/20 text-green-400';
      case 'all': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredModules = trainingModules.filter(module => 
    selectedRole === 'all' || module.role === selectedRole || module.role === 'all'
  );

  const totalModules = filteredModules.length;
  const completedModules = filteredModules.filter(m => m.completed).length;
  const overallProgress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-black/30 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Training Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{completedModules}/{totalModules}</div>
              <div className="text-white/70">Modules Completed</div>
              <Progress value={overallProgress} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {Math.round(overallProgress)}%
              </div>
              <div className="text-white/70">Overall Progress</div>
              <div className="text-sm text-green-400 mt-2">
                {overallProgress === 100 ? 'All Complete!' : 'Keep Going!'}
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {trainingModules.filter(m => !m.completed).length}
              </div>
              <div className="text-white/70">Remaining</div>
              <div className="text-sm text-white/50 mt-2">Training modules</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Filter */}
      <Card className="bg-black/30 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            Filter by Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(['all', 'scheduler', 'editor', 'social_manager'] as const).map((role) => (
              <Button
                key={role}
                variant={selectedRole === role ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedRole(role)}
                className="text-white/70 hover:text-white"
              >
                {role === 'all' ? 'All Roles' : role.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredModules.map((module) => (
          <Card key={module.id} className="bg-black/30 backdrop-blur-lg border-white/10 hover:bg-white/5 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge className={getTypeColor(module.type)}>
                    {getTypeIcon(module.type)}
                  </Badge>
                  <Badge className={getRoleColor(module.role)}>
                    {module.role === 'all' ? 'All Roles' : module.role.replace('_', ' ')}
                  </Badge>
                </div>
                
                {module.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-400" />
                )}
              </div>

              <h3 className="text-white font-semibold text-lg mb-2">{module.title}</h3>
              <p className="text-white/70 text-sm mb-4">{module.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Duration: {module.duration}</span>
                  <span className="text-white/70">Progress: {module.progress}%</span>
                </div>

                <Progress value={module.progress} className="h-2" />

                <div className="flex gap-2 pt-2">
                  {module.completed ? (
                    <Button variant="outline" className="flex-1 text-white border-white/20">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  ) : (
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                      <Play className="h-4 w-4 mr-2" />
                      {module.progress > 0 ? 'Continue' : 'Start'}
                    </Button>
                  )}
                  
                  {module.url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-white border-white/20"
                      onClick={() => window.open(module.url, '_blank')}
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Training Resources */}
      <Card className="bg-black/30 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="text-white font-medium mb-2">Standard Operating Procedures</h4>
              <p className="text-white/70 text-sm mb-3">Comprehensive SOPs for all team processes</p>
              <Button variant="outline" size="sm" className="text-white border-white/20">
                <FileText className="h-4 w-4 mr-2" />
                View SOPs
              </Button>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="text-white font-medium mb-2">Video Tutorials</h4>
              <p className="text-white/70 text-sm mb-3">Step-by-step video guides and demonstrations</p>
              <Button variant="outline" size="sm" className="text-white border-white/20">
                <Video className="h-4 w-4 mr-2" />
                Watch Tutorials
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingView;
