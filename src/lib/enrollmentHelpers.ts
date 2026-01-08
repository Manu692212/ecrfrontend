import { ApplicationRow } from '@/components/admin/ApplicationsTable';

const getName = (student: any) => {
  if (!student) return 'Student';
  const first = student.first_name ?? student.name ?? '';
  const last = student.last_name ?? '';
  const combined = `${first} ${last}`.trim();
  return combined || 'Student';
};

export function mapEnrollmentToRow(enrollment: any): ApplicationRow {
  return {
    id: String(enrollment.id),
    studentName: getName(enrollment.student),
    studentEmail: enrollment.student?.email ?? enrollment.student?.contact_email ?? '—',
    courseTitle: enrollment.course?.title ?? enrollment.course?.name ?? '—',
    submittedAt: new Date(enrollment.created_at).toLocaleString(),
    remarks: enrollment.remarks,
  };
}
