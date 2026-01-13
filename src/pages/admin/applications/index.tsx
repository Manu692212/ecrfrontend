import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ApplicationsTable, { ApplicationRow } from '@/components/admin/ApplicationsTable';
import { applicationsAPI } from '@/lib/api';

interface ApplicationDetail extends ApplicationRow {
  payload?: Record<string, unknown>;
  admin_notes?: string;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'in_review', label: 'In Review' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
];

export default function AdminApplicationsPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [meta, setMeta] = useState<{ total: number }>({ total: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | number | undefined>(undefined);
  const [selectedDetails, setSelectedDetails] = useState<ApplicationDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusValue, setStatusValue] = useState<string>('new');
  const [notesValue, setNotesValue] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const formatFormType = (value?: string | null) => {
    if (!value) return 'General';
    return value.replace(/[-_]/g, ' ');
  };

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationsAPI.list();
      setApplications(response.data || []);
      setMeta({ total: response.meta?.total ?? response.data?.length ?? 0 });
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleViewDetails = async (submission: ApplicationRow) => {
    setSelectedId(submission.id);
    setIsDialogOpen(true);
    setDetailLoading(true);
    try {
      const detail = await applicationsAPI.getById(submission.id);
      setSelectedDetails(detail);
      setStatusValue(detail?.status || 'new');
      setNotesValue(detail?.admin_notes || '');
    } catch (err: any) {
      setError(err?.message || 'Failed to load application details');
      setSelectedDetails(null);
      setStatusValue('new');
      setNotesValue('');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateApplication = async () => {
    if (!selectedDetails?.id) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        status: statusValue,
        admin_notes: notesValue,
      };
      const response = await applicationsAPI.update(selectedDetails.id, payload);
      const updated = response?.application ?? { ...selectedDetails, ...payload };

      setSelectedDetails((prev) =>
        prev ? { ...prev, status: updated.status, admin_notes: updated.admin_notes } : prev
      );
      setApplications((prev) =>
        prev.map((item) =>
          item.id === selectedDetails.id ? { ...item, status: updated.status } : item
        )
      );
      toast({
        title: 'Application updated',
        description: 'Status and notes saved successfully.',
      });
    } catch (err: any) {
      const message = err?.message || 'Failed to update application';
      setError(message);
      toast({
        title: 'Update failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const renderDialogBody = () => {
    if (detailLoading) {
      return <p className="text-sm text-muted-foreground">Loading details...</p>;
    }

    if (!selectedDetails) {
      return (
        <p className="text-sm text-muted-foreground">
          Select an application from the table to view its details.
        </p>
      );
    }

    const metadata = selectedDetails.payload || {};
    const courseLabel =
      typeof metadata['course'] === 'string' ? (metadata['course'] as string) : undefined;
    const message =
      typeof metadata['message'] === 'string' ? (metadata['message'] as string) : undefined;
    const formTypeLabel = formatFormType(selectedDetails.form_type);

    return (
      <div className="space-y-4 text-sm">
        <p className="text-lg font-semibold text-foreground">
          {selectedDetails.full_name || 'Applicant'} · {formTypeLabel}
        </p>
        <p className="text-muted-foreground">{selectedDetails.title || courseLabel || '—'}</p>
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <p>
            <span className="font-medium text-foreground">Email:</span> {selectedDetails.email}
          </p>
          {selectedDetails.phone && (
            <p>
              <span className="font-medium text-foreground">Phone:</span> {selectedDetails.phone}
            </p>
          )}
          <p className="sm:col-span-2">
            <span className="font-medium text-foreground">Message:</span>{' '}
            {message || '—'}
          </p>
          <p>
            <span className="font-medium text-foreground">Submitted:</span>{' '}
            {selectedDetails.created_at
              ? new Date(selectedDetails.created_at).toLocaleString()
              : '—'}
          </p>
          {selectedDetails.status && (
            <p>
              <span className="font-medium text-foreground">Status:</span>{' '}
              {selectedDetails.status.replace('_', ' ')}
            </p>
          )}
        </div>
        <div className="space-y-3 border-t border-border pt-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">Status</p>
            <Select value={statusValue} onValueChange={setStatusValue}>
              <SelectTrigger className="h-11 text-sm font-medium capitalize">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">Admin notes</p>
            <Textarea
              value={notesValue}
              onChange={(event) => setNotesValue(event.target.value)}
              rows={4}
              placeholder="Add context for other admins..."
            />
          </div>
        </div>
      </div>
    );
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
          {meta.total} submissions
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Applications</CardTitle>
            <span className="text-xs text-muted-foreground">
              {loading ? 'Fetching latest...' : 'Newest first'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
              {error}
            </p>
          )}
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading applications...</p>
          ) : (
            <ApplicationsTable
              applications={applications}
              selectedId={selectedId}
              onView={handleViewDetails}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application details</DialogTitle>
            <DialogDescription>Review submitted data before reaching out.</DialogDescription>
          </DialogHeader>
          {renderDialogBody()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleUpdateApplication} disabled={saving || detailLoading}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
