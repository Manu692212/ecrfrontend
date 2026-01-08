import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function AdminApplicationsPage() {
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
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-sm text-muted-foreground">
            All submissions sent through the public apply/contact forms.
          </p>
        </div>
        <Button variant="ghost" size="sm" className="text-xs uppercase tracking-[0.4em]">
          {applicantSubmissions.length} submissions
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Applications</CardTitle>
            <span className="text-xs text-muted-foreground">Newest first</span>
          </div>
        </CardHeader>
        <CardContent>
          <ApplicationsTable
            applications={applicantSubmissions}
            selectedId={selectedDetails?.id}
            onView={handleViewDetails}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application details</DialogTitle>
            <DialogDescription>Review submitted data before reaching out.</DialogDescription>
          </DialogHeader>
          {selectedDetails ? (
            <div className="space-y-4 text-sm">
              <p className="text-lg font-semibold text-foreground">
                {selectedDetails.name} · {selectedDetails.type}
              </p>
              <p className="text-muted-foreground">{selectedDetails.course}</p>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  <span className="font-medium text-foreground">Email:</span> {selectedDetails.email}
                </p>
                <p>
                  <span className="font-medium text-foreground">Phone:</span> {selectedDetails.phone}
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
              Select an application from the table to view its details.
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
