import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import FacilityList from './FacilityList';
import FacilityForm, { FacilityFormValues } from './FacilityForm';
import { facilitiesAPI } from '@/lib/api';

const resolveFacilityForForm = (facility: any): FacilityFormValues & { imageUrl?: string } => {
  const image = facility?.image_url ?? facility?.image ?? null;

  const imageUrl = (() => {
    if (!image) return undefined;
    if (typeof image === 'string' && image.startsWith('http')) return image;
    const baseApi = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const mediaBase = baseApi.replace(/\/api$/, '') + '/media';
    const sanitized = String(image).replace(/^\/+/, '');
    return `${mediaBase}/${sanitized}`;
  })();

  return {
    name: facility?.name ?? '',
    label: facility?.label ?? '',
    description: facility?.description ?? '',
    category: facility?.category ?? '',
    status: facility?.status === 'inactive' ? 'inactive' : 'active',
    order: typeof facility?.order === 'number' ? facility.order : 0,
    imageUrl,
  };
};

const fetchFacility = async (id: string) => {
  const response = await facilitiesAPI.getById(id);
  return resolveFacilityForForm(response?.data ?? response);
};

const createFacility = async (payload: FacilityFormValues) => {
  const formData = new FormData();
  formData.append('name', payload.name);
  if (payload.label) formData.append('label', payload.label);
  formData.append('description', payload.description);
  if (payload.category) formData.append('category', payload.category);
  formData.append('status', payload.status);
  if (typeof payload.order === 'number') formData.append('order', String(payload.order));
  if (payload.image instanceof File) {
    formData.append('image', payload.image);
  }
  return facilitiesAPI.create(formData);
};

const updateFacility = async ({ id, data }: { id: string; data: FacilityFormValues }) => {
  const basePayload: Record<string, any> = {
    name: data.name,
    label: data.label,
    description: data.description,
    category: data.category,
    status: data.status,
    order: data.order,
  };

  await facilitiesAPI.update(id, basePayload);

  if (data.image instanceof File) {
    await facilitiesAPI.uploadImage(id, data.image);
  }

  const refreshed = await facilitiesAPI.getById(id);
  return resolveFacilityForForm(refreshed?.data ?? refreshed);
};

function CreateFacility() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities', 'list'] });
      navigate('/admin/facilities');
    },
  });

  return (
    <FacilityForm
      onSubmit={(values) => mutation.mutateAsync(values).then(() => {})}
      isLoading={mutation.isPending}
    />
  );
}

function EditFacility() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: facility, isLoading } = useQuery({
    queryKey: ['facilities', 'detail', id],
    queryFn: () => fetchFacility(id!),
    enabled: Boolean(id),
  });

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FacilityFormValues }) => updateFacility({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['facilities', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['facilities', 'detail', variables.id] });
      navigate('/admin/facilities');
    },
  });

  if (isLoading) {
    return <div>Loading facility...</div>;
  }

  if (!id || !facility) {
    return <div>Facility not found</div>;
  }

  return (
    <FacilityForm
      defaultValues={facility}
      isEdit
      onSubmit={(values) =>
        mutation.mutateAsync({ id, data: values }).then(() => {})
      }
      isLoading={mutation.isPending}
    />
  );
}

const FacilitiesPage = () => {
  return (
    <Routes>
      <Route path="/" element={<FacilityList />} />
      <Route path="/new" element={<CreateFacility />} />
      <Route path=":id/edit" element={<EditFacility />} />
    </Routes>
  );
};

export default FacilitiesPage;
