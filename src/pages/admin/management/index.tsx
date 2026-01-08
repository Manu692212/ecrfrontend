import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ManagementList from './ManagementList';
import ManagementMemberForm, { ManagementFormValues } from './ManagementMemberForm';
import { managementAPI } from '@/lib/api';

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

const mapApiMemberToFormValues = (m: any): ManagementFormValues & { image?: string | null } => ({
  name: m.name ?? '',
  position: m.position ?? '',
  designation: m.designation ?? '',
  department: m.department ?? '',
  bio: m.bio ?? '',
  qualifications: m.qualifications ?? '',
  status: m.is_active ? 'active' : 'inactive',
  image: resolveMemberImage(m),
});

const fetchMember = async (id: string) => {
  const member = await managementAPI.getById(id);
  return mapApiMemberToFormValues(member);
};

const createMember = async (data: ManagementFormValues) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('position', data.position);
  if (data.designation) formData.append('designation', data.designation);
  if (data.department) formData.append('department', data.department);
  if (data.bio) formData.append('bio', data.bio);
  if (data.qualifications) formData.append('qualifications', data.qualifications);
  formData.append('order', '0');
  formData.append('is_active', data.status === 'active' ? '1' : '0');
  if (data.image instanceof File) {
    formData.append('image', data.image);
    formData.append('image_size', 'medium');
  }

  const created = await managementAPI.create(formData);
  return created;
};

const updateMember = async ({ id, data }: { id: string; data: ManagementFormValues }) => {
  const payload: any = {
    name: data.name,
    position: data.position,
    department: data.department,
    bio: data.bio,
    qualifications: data.qualifications,
    designation: data.designation,
    is_active: data.status === 'active',
  };

  await managementAPI.update(id, payload);

  if (data.image instanceof File) {
    await managementAPI.uploadImage(id, data.image, { image_size: 'medium' });
  }

  const updated = await managementAPI.getById(id);
  return mapApiMemberToFormValues(updated);
};

function CreateManagementMember() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMemberMutation = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['management', 'list'] });
      navigate('/admin/management');
    },
  });

  return (
    <ManagementMemberForm
      onSubmit={async (data) => {
        await createMemberMutation.mutateAsync(data);
      }}
      isLoading={createMemberMutation.isPending}
    />
  );
}

function EditManagementMember() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: member, isLoading } = useQuery({
    queryKey: ['management-member', id],
    queryFn: () => fetchMember(id!),
    enabled: !!id,
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ManagementFormValues }) => updateMember({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['management', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['management-member', variables.id] });
      navigate('/admin/management');
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!member || !id) {
    return <div>Member not found</div>;
  }

  return (
    <ManagementMemberForm
      defaultValues={member}
      isEdit
      onSubmit={async (data) => {
        await updateMemberMutation.mutateAsync({ id, data });
      }}
      isLoading={updateMemberMutation.isPending}
    />
  );
}

export default function ManagementPage() {
  return (
    <Routes>
      <Route path="/" element={<ManagementList />} />
      <Route path="new" element={<CreateManagementMember />} />
      <Route path=":id/edit" element={<EditManagementMember />} />
    </Routes>
  );
}
