import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  FileText,
  Bell,
  Upload,
  Download
} from 'lucide-react';
import { reportsAPI, studentsAPI, notificationsAPI } from '@/lib/api';

interface DashboardStats {
  total_students: number;
  total_courses: number;
  total_enrollments: number;
  active_enrollments: number;
  total_revenue: number;
}

interface RecentEnrollment {
  id: number;
  student: { first_name: string; last_name: string; email: string };
  course: { title: string; code: string };
  enrollment_date: string;
  amount_paid: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dashboardData, notificationsData, unreadData] = await Promise.all([
        reportsAPI.dashboard(),
        notificationsAPI.getAll(),
        notificationsAPI.getUnreadCount()
      ]);
      
      setStats(dashboardData.stats);
      setRecentEnrollments(dashboardData.recent_enrollments);
      setNotifications(notificationsData.data || []);
      setUnreadCount(unreadData.count);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (studentId: string, file: File) => {
    try {
      await studentsAPI.uploadResume(studentId, file);
      alert('Resume uploaded successfully!');
    } catch (error) {
      alert('Failed to upload resume');
    }
  };

  const handleFileDownload = async (studentId: string) => {
    try {
      const blob = await studentsAPI.downloadResume(studentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download resume');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your ECR Academy management system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_students || 0}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_courses || 0}</div>
              <p className="text-xs text-muted-foreground">Available courses</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.active_enrollments || 0}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.total_revenue || 0}</div>
              <p className="text-xs text-muted-foreground">Total collected</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Enrollments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Enrollments</CardTitle>
                <CardDescription>Latest student enrollments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {enrollment.student.first_name} {enrollment.student.last_name}
                          </span>
                          <Badge variant="secondary">{enrollment.course.code}</Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {enrollment.course.title} • ${enrollment.amount_paid}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(enrollment.enrollment_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFileUpload(enrollment.student.id.toString(), new File([''], 'test.pdf'))}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFileDownload(enrollment.student.id.toString())}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {recentEnrollments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No recent enrollments
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>System updates</CardDescription>
                </div>
                {unreadCount > 0 && (
                  <Badge variant="destructive">{unreadCount}</Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {JSON.parse(notification.data || '{}').title || 'Notification'}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {JSON.parse(notification.data || '{}').message || 'No message'}
                          </div>
                        </div>
                        {!notification.read_at && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No notifications
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  Add Student
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BookOpen className="h-6 w-6 mb-2" />
                  Add Course
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  View Reports
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Bell className="h-6 w-6 mb-2" />
                  Send Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
