import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { adminsAPI } from '@/lib/api';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
}

const BADGE_CLASS = (isActive: boolean) =>
  isActive ? 'bg-green-100 text-green-800' : 'bg-destructive/10 text-destructive';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminsAPI.getAll();
      setUsers(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleView = (user: AdminUser) => {
    setSelectedUser(user);
    setFormState({ name: user.name, email: user.email, password: '', role: user.role });
    setDialogOpen(true);
  };

  const handleToggleActive = async (user: AdminUser) => {
    setSaving(true);
    try {
      await adminsAPI.update(user.id.toString(), { is_active: !user.is_active });
      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id ? { ...item, is_active: !item.is_active } : item
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedUser && !formState.password) {
      setError('Password required for creation');
      return;
    }
    setSaving(true);
    try {
      if (selectedUser) {
        const payload: any = {
          name: formState.name,
          email: formState.email,
          role: formState.role,
        };
        if (formState.password) payload.password = formState.password;
        await adminsAPI.update(selectedUser.id.toString(), payload);
        setUsers((prev) =>
          prev.map((item) =>
            item.id === selectedUser.id
              ? {
                  ...item,
                  name: formState.name,
                  email: formState.email,
                  role: formState.role as 'admin' | 'super_admin',
                }
              : item
          )
        );
      } else {
        await adminsAPI.create({
          ...formState,
        });
        await fetchUsers();
      }
      setDialogOpen(false);
      setSelectedUser(null);
      setFormState({ name: '', email: '', password: '', role: 'admin' });
    } catch (err: any) {
      setError(err.message || 'Failed to save admin');
    } finally {
      setSaving(false);
    }
  };

  const paginationButtons = useMemo(() => null, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-sm text-muted-foreground">Create, update, or deactivate admin accounts.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>Add Admin</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Administrators</CardTitle>
              <CardDescription>Guarded by the admin API.</CardDescription>
            </div>
            <div>{paginationButtons}</div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading admins...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-background/50 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">Role</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border last:border-b-0">
                      <td className="py-3 px-3 font-medium text-foreground">{user.name}</td>
                      <td className="py-3 px-3 text-muted-foreground">{user.email}</td>
                      <td className="py-3 px-3 text-muted-foreground">{user.role}</td>
                      <td className="py-3 px-3">
                        <Badge className={BADGE_CLASS(user.is_active)}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleView(user)}>
                          Details
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleToggleActive(user)}>
                          {saving ? 'Saving...' : user.is_active ? 'Disable' : 'Enable'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser ? 'Edit Admin' : 'Add Admin'}</DialogTitle>
            <DialogDescription>Manage admin credentials and roles.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Name</label>
            <Input
              value={formState.name}
              onChange={(event) => setFormState({ ...formState, name: event.target.value })}
            />
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</label>
            <Input
              value={formState.email}
              onChange={(event) => setFormState({ ...formState, email: event.target.value })}
            />
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Password {selectedUser ? '(leave blank to keep current)' : ''}
            </label>
            <Input
              type="password"
              value={formState.password}
              onChange={(event) => setFormState({ ...formState, password: event.target.value })}
            />
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Role</label>
            <div className="flex gap-2">
              {['admin', 'super_admin'].map((role) => (
                <Button
                  key={role}
                  variant={formState.role === role ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormState({ ...formState, role: role as 'admin' | 'super_admin' })}
                >
                  {role.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
