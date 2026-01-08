import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, BookOpen, Briefcase, Building2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import ApplicationsTable from '@/components/admin/ApplicationsTable';
import { ApplicantSubmission, applicantSubmissions } from '@/data/applications';

const stats = [
  { name: 'Total Students', value: '1,234', icon: Users, change: '+12% from last month' },
  { name: 'Active Courses', value: '24', icon: BookOpen, change: '+4 from last month' },
  { name: 'Job Openings', value: '15', icon: Briefcase, change: '+3 from last month' },
  { name: 'Facilities', value: '8', icon: Building2, change: '2 under maintenance' },
];

const quickActions = [
  { name: 'Add New Course', icon: BookOpen, href: '/admin/courses/new' },
  { name: 'View Applications', icon: Briefcase, href: '/admin/applications' },
  { name: 'Manage Users', icon: Users, href: '/admin/settings/users' },
  { name: 'System Settings', icon: Settings, href: '/admin/settings' },
];

export default function Dashboard() {
  const [selectedApplication, setSelectedApplication] = useState<ApplicantSubmission | null>(
    applicantSubmissions[0]
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const selectedDetails = useMemo(() => selectedApplication || null, [selectedApplication]);

  const handleViewDetails = (submission: ApplicantSubmission) => {
    setSelectedApplication(submission);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Quick Actions */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  to={action.href}
                  className="flex items-center rounded-lg border p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium leading-none">{action.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Applicant Submissions */}
        <Card className="col-span-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Applications</CardTitle>
              <button className="text-sm font-medium text-primary hover:underline">
                From home apply form
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <ApplicationsTable
                applications={applicantSubmissions}
                selectedId={selectedDetails?.id}
                onView={handleViewDetails}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application details</DialogTitle>
            <DialogDescription>
              View the submission that was sent via the home apply form.
            </DialogDescription>
          </DialogHeader>
          {selectedDetails ? (
            <div className="space-y-4 text-sm">
              <p className="text-lg font-semibold text-foreground">
                {selectedDetails.name} · {selectedDetails.type}
              </p>
              <p className="text-muted-foreground">{selectedDetails.course}</p>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  <span className="font-medium text-foreground">Email:</span>{' '}
                  {selectedDetails.email}
                </p>
                <p>
                  <span className="font-medium text-foreground">Phone:</span>{' '}
                  {selectedDetails.phone}
                </p>
                <p className="sm:col-span-2">
                  <span className="font-medium text-foreground">Message:</span>{' '}
                  {selectedDetails.message}
                </p>
                <p>
                  <span className="font-medium text-foreground">Submitted:</span>{' '}
                  {selectedDetails.submittedAt}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select an application row to view its full details.
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
