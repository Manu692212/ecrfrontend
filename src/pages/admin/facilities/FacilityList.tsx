import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { facilitiesAPI } from '@/lib/api';
import { ImageIcon, Pencil, Plus, Search, Trash2 } from 'lucide-react';

interface FacilityRecord {
  id: string;
  name: string;
  label?: string;
  category?: string;
  description?: string;
  status: 'active' | 'inactive';
  order?: number;
  image?: string;
}

const resolveFacilityImage = (facility: any) => {
  if (facility?.image_url) {
    return facility.image_url;
  }

  const rawImage = facility?.image;
  if (!rawImage) return undefined;

  const baseApi = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  const mediaBase = baseApi.replace(/\/api$/, '') + '/media';
  const sanitized = String(rawImage).replace(/^\/+/, '');
  return `${mediaBase}/${sanitized}`;
};

const mapFacilityRecord = (facility: any): FacilityRecord => ({
  id: String(facility?.id ?? ''),
  name: facility?.name ?? 'Unnamed Facility',
  label: facility?.label ?? undefined,
  category: facility?.category ?? undefined,
  description: facility?.description ?? undefined,
  status: facility?.status === 'inactive' ? 'inactive' : 'active',
  order: typeof facility?.order === 'number' ? facility.order : undefined,
  image: resolveFacilityImage(facility),
});

const FacilityList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['facilities', 'list'],
    queryFn: () => facilitiesAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => facilitiesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities', 'list'] });
    },
  });

  const facilities = useMemo(() => {
    const rawRecords: any[] = data?.data ?? [];
    return rawRecords.map(mapFacilityRecord);
  }, [data]);

  const filteredFacilities = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return facilities;

    return facilities.filter((facility) => {
      const label = facility.label ?? '';
      const category = facility.category ?? '';
      return (
        facility.name.toLowerCase().includes(term) ||
        label.toLowerCase().includes(term) ||
        category.toLowerCase().includes(term)
      );
    });
  }, [facilities, searchTerm]);

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this facility? This action cannot be undone.')) return;
    deleteMutation.mutate(id);
  };

  const hasFacilities = facilities.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Facilities</h1>
          <p className="text-sm text-muted-foreground">
            Manage the facilities showcased on the public website.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
          <div className="relative w-full md:w-64">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search facilities"
              className="pl-8"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <Button asChild>
            <Link to="/admin/facilities/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Facility
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Facility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Display Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-28 text-center">
                  Loading facilities...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-28 text-center text-red-600">
                  Failed to load facilities. Please refresh the page.
                </TableCell>
              </TableRow>
            ) : filteredFacilities.length > 0 ? (
              filteredFacilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-muted">
                        {facility.image ? (
                          <img
                            src={facility.image}
                            alt={facility.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{facility.name}</p>
                        {facility.label && (
                          <p className="text-sm text-muted-foreground">{facility.label}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        facility.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {facility.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">{facility.category || '—'}</TableCell>
                  <TableCell>{facility.order ?? '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link to={`/admin/facilities/${facility.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(facility.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : hasFacilities ? (
              <TableRow>
                <TableCell colSpan={5} className="h-28 text-center text-muted-foreground">
                  No facilities match your search.
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-28 text-center text-muted-foreground">
                  No facility records available yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FacilityList;
