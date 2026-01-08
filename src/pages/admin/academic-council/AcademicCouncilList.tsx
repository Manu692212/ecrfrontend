import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Pencil, Trash2, User, FileDown, Presentation } from 'lucide-react';
import { academicCouncilAPI } from '@/lib/api';
import { loadJsPdf, loadPptxGen, loadToPng } from '@/lib/export-utils';

type Member = {
  id: string;
  name: string;
  position: string;
  designation?: string;
  department?: string;
  image?: string;
  status: 'active' | 'inactive';
};

export default function AcademicCouncilList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const queryClient = useQueryClient();
  const exportGridRef = useRef<HTMLDivElement>(null);

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

    return undefined;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['academic-council', 'list'],
    queryFn: () => academicCouncilAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => academicCouncilAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-council', 'list'] });
    },
  });

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    deleteMutation.mutate(id);
  };

  const apiMembers: any[] = data?.data ?? [];

  const members: Member[] = apiMembers.map((m) => ({
    id: String(m.id),
    name: m.name ?? '',
    position: m.position ?? '',
    designation: m.designation ?? undefined,
    department: m.department ?? undefined,
    image: resolveMemberImage(m),
    status: m.is_active ? 'active' : 'inactive',
  }));

  const normalizedSearch = searchTerm.toLowerCase();
  const filteredMembers = members.filter((member) => {
    const department = member.department ?? '';
    return (
      member.name.toLowerCase().includes(normalizedSearch) ||
      member.position.toLowerCase().includes(normalizedSearch) ||
      department.toLowerCase().includes(normalizedSearch)
    );
  });

  const hasMembers = members.length > 0;

  const waitForExportMedia = useCallback(async () => {
    if (!exportGridRef.current) return;
    const images = Array.from(exportGridRef.current.querySelectorAll('img'));

    await Promise.all(
      images.map((img) => {
        if (img.complete && img.naturalWidth > 0) {
          return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
          const handleComplete = () => resolve();
          img.addEventListener('load', handleComplete, { once: true });
          img.addEventListener('error', handleComplete, { once: true });
        });
      })
    );
  }, []);

  const generateImage = useCallback(async () => {
    const toPng = await loadToPng();
    const node = exportGridRef.current;
    if (!node) {
      throw new Error('Nothing to export yet.');
    }

    await waitForExportMedia();

    const clone = node.cloneNode(true) as HTMLElement;
    const originalComputed = typeof window !== 'undefined' ? window.getComputedStyle(node) : null;

    clone.removeAttribute('aria-hidden');
    clone.style.position = 'fixed';
    clone.style.left = '0';
    clone.style.top = '0';
    clone.style.pointerEvents = 'none';
    clone.style.zIndex = '-1';
    clone.style.visibility = 'visible';
    clone.style.opacity = '1';
    clone.style.width = `${node.offsetWidth}px`;
    clone.style.height = `${node.offsetHeight}px`;
    if (originalComputed?.background) {
      clone.style.background = originalComputed.background;
    }

    document.body.appendChild(clone);

    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    try {
      const rect = clone.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        console.warn('Academic council admin export target has zero size', {
          width: rect.width,
          height: rect.height,
          offsetWidth: clone.offsetWidth,
          offsetHeight: clone.offsetHeight,
        });
      }

      const computed = typeof window !== 'undefined' ? window.getComputedStyle(clone) : null;
      const backgroundColor = computed?.backgroundColor ?? '#f8f7ff';

      const dataUrl = await toPng(clone, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor,
        useCORS: true,
      });

      if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/png')) {
        console.warn('Academic council admin export produced unexpected data URL', { length: (dataUrl as any)?.length });
        throw new Error('Unable to render academic council admin export image.');
      }

      console.info('Academic council admin export PNG generated', {
        length: dataUrl.length,
        width: rect.width,
        height: rect.height,
      });

      if (typeof window !== 'undefined') {
        (window as any).__academicCouncilAdminExportImage = dataUrl;
        (window as any).__academicCouncilAdminExportMeta = {
          width: rect.width,
          height: rect.height,
          length: dataUrl.length,
        };
      }

      return dataUrl;
    } finally {
      document.body.removeChild(clone);
    }
  }, [waitForExportMedia]);

  const handleExportPdf = useCallback(async () => {
    if (!hasMembers) return;
    try {
      console.info('Starting academic council admin PDF export');
      setIsExporting(true);
      const dataUrl = await generateImage();
      const JsPdf = await loadJsPdf();
      const pdf = new JsPdf('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
      pdf.save('academic-council-pamphlet.pdf');
    } catch (error) {
      console.error('Unable to export academic council pamphlet to PDF', error);
      window.alert('Unable to export academic council pamphlet right now. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [generateImage, hasMembers]);

  const handleExportPpt = useCallback(async () => {
    if (!hasMembers) return;
    try {
      console.info('Starting academic council admin PPT export');
      setIsExporting(true);
      const dataUrl = await generateImage();
      const PptxGen = await loadPptxGen();
      const pptx = new PptxGen();
      const slide = pptx.addSlide();

      const slideWidth = pptx.layout?.width ?? 13.33; // 16:9 default width in inches
      const slideHeight = pptx.layout?.height ?? 7.5;

      slide.addImage({
        data: dataUrl,
        x: 0,
        y: 0,
        w: slideWidth,
        h: slideHeight,
      });

      await pptx.writeFile('academic-council-pamphlet.pptx');
    } catch (error) {
      console.error('Unable to export academic council pamphlet to PPT', error);
      window.alert('Unable to export academic council pamphlet right now. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [generateImage, hasMembers]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
          <h1 className="text-2xl font-bold tracking-tight">Academic Council</h1>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPdf}
                disabled={isExporting || !hasMembers}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPpt}
                disabled={isExporting || !hasMembers}
              >
                <Presentation className="mr-2 h-4 w-4" />
                Export PPT
              </Button>
              <Button asChild>
                <Link to="/admin/academic-council/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Loading members...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-red-600">
                    Failed to load members.
                  </TableCell>
                </TableRow>
              ) : filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          {member.image ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              crossOrigin="anonymous"
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          {member.designation && (
                            <div className="text-xs text-muted-foreground">{member.designation}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          member.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/academic-council/${member.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination will go here */}
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>

      <div
        ref={exportGridRef}
        aria-hidden="true"
        className="pointer-events-none absolute -left-[12000px] top-0 w-[1280px] bg-gradient-to-b from-[#f5f2ff] via-white to-white px-12 py-14"
      >
        <div className="space-y-10">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold text-slate-900">Academic Council</h1>
            <p className="mt-3 text-base text-slate-600">
              Distinguished faculty and resource persons driving academic excellence at ECR Academy
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center gap-4 rounded-3xl border border-primary/10 bg-white/90 p-8 text-center shadow-xl shadow-primary/5"
              >
                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-primary/20 bg-gradient-to-br from-secondary to-muted">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      crossOrigin="anonymous"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-primary">
                      {member.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-semibold text-slate-900">{member.name}</h3>
                  {member.designation && (
                    <p className="text-sm font-medium text-primary">{member.designation}</p>
                  )}
                  {member.position && (
                    <p className="text-xs uppercase tracking-wider text-slate-500">{member.position}</p>
                  )}
                  {member.department && (
                    <p className="text-xs text-slate-500">Department of {member.department}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
