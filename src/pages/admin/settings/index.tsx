import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { settingsAPI } from '@/lib/api';

interface Setting {
  id: number;
  key: string;
  value: string | null;
  type: 'text' | 'number' | 'boolean' | 'json';
  group: string;
  description: string | null;
  is_public: boolean;
}

const BadgeForGroup = ({ group }: { group: string }) => {
  const color = group === 'home' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary';
  return <Badge className={color}>{group}</Badge>;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState<{ current_page: number; last_page: number }>({ current_page: 1, last_page: 1 });

  const fetchSettings = async (pageNumber = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await settingsAPI.getAll(pageNumber);
      setSettings(response.data || []);
      setMeta({
        current_page: response.current_page || pageNumber,
        last_page: response.last_page || 1,
      });
    } catch (err: any) {
      setError(err.message || 'Unable to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings(page);
  }, [page]);

  const openEdit = (setting: Setting) => {
    setSelectedSetting(setting);
    setValue(setting.value ?? '');
    setDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedSetting) return;
    setSaving(true);
    try {
      await settingsAPI.update(selectedSetting.id, { value: value });
      setSettings((prev) =>
        prev.map((item) => (item.id === selectedSetting.id ? { ...item, value } : item))
      );
      setDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const paginationButtons = useMemo(() => {
    const buttons = [];
    for (let i = 1; i <= meta.last_page; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === meta.current_page ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPage(i)}
        >
          {i}
        </Button>
      );
    }
    return buttons;
  }, [meta.current_page, meta.last_page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-sm text-muted-foreground">Manage key/value configuration that drives the site.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Protected during admin sessions.</CardDescription>
            </div>
            <div className="space-x-2">{paginationButtons}</div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading settings...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <div className="space-y-3">
              {settings.map((setting) => (
                <div key={setting.id} className="grid grid-cols-1 gap-3 rounded-xl border border-border p-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Key</p>
                    <p className="text-sm font-medium text-foreground">{setting.key}</p>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Value</p>
                    <p className="font-medium">{setting.value ?? '—'}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Metadata</p>
                      <div className="flex items-center gap-2">
                        <BadgeForGroup group={setting.group} />
                        <Badge className="bg-background text-muted-foreground">{setting.type}</Badge>
                        {setting.is_public && <Badge className="bg-green-100 text-green-800">public</Badge>}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => openEdit(setting)}>
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Settings are stored via the backend API; editing affects the public content immediately.
          </p>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Setting</DialogTitle>
            <DialogDescription>Update the selected key.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Key</label>
            <Input readOnly value={selectedSetting?.key ?? ''} />
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Value</label>
            <Input value={value} onChange={(event) => setValue(event.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={!selectedSetting || saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
