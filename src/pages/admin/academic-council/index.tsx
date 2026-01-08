import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AcademicCouncilList from './AcademicCouncilList';
import MemberForm, { MemberFormValues } from './MemberForm';
import { academicCouncilAPI } from '@/lib/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const MEDIA_BASE_URL = API_BASE_URL.replace(/\/api$/, '') + '/media';

const resolveMemberImage = (member: any) => {
  if (member?.image_url) {
    return member.image_url;
  }

  if (member?.image) {
    const sanitized = String(member.image).replace(/^\/+/, '');
    return `${MEDIA_BASE_URL}/${sanitized}`;
  }

  return null;
};

const mapApiMemberToFormValues = (m: any): MemberFormValues & { image?: string | null } => ({
  name: m.name ?? '',
  position: m.position ?? '',
  designation: m.designation ?? '',
  department: m.department ?? '',
  bio: m.bio ?? '',
  qualifications: m.qualifications ?? '',
  status: m.is_active ? 'active' : ('inactive' as 'inactive'),
  image: resolveMemberImage(m),
});

const fetchMember = async (id: string) => {
  const member = await academicCouncilAPI.getById(id);
  return mapApiMemberToFormValues(member);
};

const createMember = async (data: MemberFormValues) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('position', data.position);
  if (data.designation) formData.append('designation', data.designation);
  if (data.bio) formData.append('bio', data.bio);
  if (data.qualifications) formData.append('qualifications', data.qualifications);
  if (data.department) formData.append('department', data.department);
  formData.append('order', '0');
  formData.append('is_active', data.status === 'active' ? '1' : '0');
  if (data.image instanceof File) {
    formData.append('image', data.image);
    formData.append('image_size', 'medium');
  }

  const created = await academicCouncilAPI.create(formData);
  return created;
};

const updateMember = async ({ id, data }: { id: string; data: MemberFormValues }) => {
  const payload: any = {
    name: data.name,
    position: data.position,
    department: data.department,
    bio: data.bio,
    qualifications: data.qualifications,
    designation: data.designation,
    is_active: data.status === 'active',
  };

  await academicCouncilAPI.update(id, payload);

  if (data.image instanceof File) {
    await academicCouncilAPI.uploadImage(id, data.image, { image_size: 'medium' });
  }

  const updated = await academicCouncilAPI.getById(id);
  return mapApiMemberToFormValues(updated);
};

// Member Detail Component
function MemberDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: member, isLoading } = useQuery({
    queryKey: ['member', id],
    queryFn: () => fetchMember(id!), 
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!member) {
    return <div>Member not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Academic Council Member</p>
          <h1 className="text-3xl font-bold mt-1">{member.name}</h1>
          <p className="text-base text-muted-foreground">{member.position}</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate(`/admin/academic-council/${id}/edit`)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Edit Member
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <div className="p-6 bg-white rounded-xl shadow-sm border flex flex-col items-center text-center gap-4">
            <div className="relative w-44 h-44 overflow-hidden rounded-2xl border border-muted/60 shadow-inner">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-muted to-muted/60">
                  <span className="text-5xl font-semibold text-muted-foreground">
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{member.name}</h2>
              <p className="text-sm text-muted-foreground">{member.position}</p>
              {member.department && (
                <p className="text-xs uppercase tracking-widest text-muted-foreground/80">{member.department}</p>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="mb-2 text-lg font-semibold">Contact & Status</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Department</p>
                    <p className="text-base">{member.department || '—'}</p>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1.5 text-xs font-semibold rounded-full self-start ${
                member.status === 'active'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
              </div>
            </div>
          </div>

          {member.qualifications && (
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <h2 className="mb-3 text-lg font-semibold">Qualifications</h2>
            <p className="leading-relaxed text-sm text-muted-foreground">{member.qualifications}</p>
          </div>
        )}
        
        {member.bio && (
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <h2 className="mb-3 text-lg font-semibold">Bio</h2>
            <p className="whitespace-pre-line leading-relaxed text-sm text-muted-foreground">{member.bio}</p>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}

// Create Member Component
function CreateMember() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const createMemberMutation = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      navigate('/admin/academic-council');
    },
  });

  return (
    <MemberForm
      onSubmit={async (data) => {
        await createMemberMutation.mutateAsync(data);
      }}
      isLoading={createMemberMutation.isPending}
    />
  );
}

// Edit Member Component
function EditMember() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { data: member, isLoading } = useQuery({
    queryKey: ['member', id],
    queryFn: () => fetchMember(id!),
    enabled: !!id,
  });
  
  const updateMemberMutation = useMutation({
    mutationFn: updateMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member', id] });
      navigate(`/admin/academic-council/${id}`);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!member) {
    return <div>Member not found</div>;
  }

  return (
    <MemberForm
      defaultValues={member}
      isEdit
      onSubmit={async (data) => {
        if (!id) return;
        await updateMemberMutation.mutateAsync({ id, data });
      }}
      isLoading={updateMemberMutation.isPending}
    />
  );
}

// Main Academic Council Page Component
export default function AcademicCouncilPage() {
  return (
    <Routes>
      <Route path="/" element={<AcademicCouncilList />} />
      <Route path="new" element={<CreateMember />} />
      <Route path=":id" element={<MemberDetail />} />
      <Route path=":id/edit" element={<EditMember />} />
    </Routes>
  );
}
