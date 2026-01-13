export interface ApplicationRow {
  id: string | number;
  full_name: string;
  email: string;
  phone?: string;
  form_type: string;
  title?: string;
  status?: string;
  created_at?: string;
}

interface ApplicationsTableProps {
  applications: ApplicationRow[];
  selectedId?: string | number;
  onView?: (submission: ApplicationRow) => void;
}

export default function ApplicationsTable({
  applications,
  selectedId,
  onView,
}: ApplicationsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
            <th className="py-2">ID</th>
            <th className="py-2">Applicant</th>
            <th className="py-2">Email</th>
            <th className="py-2">Type</th>
            <th className="py-2">Submitted</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((submission) => (
            <tr
              key={submission.id}
              className={`border-b border-border hover:bg-primary/5 ${
                selectedId === submission.id ? 'bg-primary/10' : ''
              }`}
            >
              <td className="py-3 text-xs font-semibold text-muted-foreground">
                {submission.id}
              </td>
              <td className="py-3 font-medium">{submission.full_name}</td>
              <td className="py-3 text-muted-foreground">{submission.email}</td>
              <td className="py-3 text-muted-foreground capitalize">{submission.form_type.replace('-', ' ')}</td>
              <td className="py-3 text-muted-foreground">
                {submission.created_at
                  ? new Date(submission.created_at).toLocaleString()
                  : '—'}
              </td>
              <td className="py-3">
                <button
                  onClick={() => onView?.(submission)}
                  className="rounded-full border border-border px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
