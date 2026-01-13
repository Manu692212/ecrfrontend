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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { settingsAPI, authAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

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
  const [passwordStep, setPasswordStep] = useState<'idle' | 'otp_sent' | 'success'>('idle');
  const [passwordOtpToken, setPasswordOtpToken] = useState('');
  const [passwordOtpCode, setPasswordOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const { refreshSession } = useAuth();

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

  const requestPasswordChangeOtp = async () => {
    setPasswordMessage(null);
    setPasswordStep('idle');
    setPasswordLoading(true);
    try {
      const response = await authAPI.requestPasswordChangeOtp();
      if (response?.otp_token) {
        setPasswordOtpToken(response.otp_token);
        setPasswordStep('otp_sent');
        setPasswordMessage('OTP sent to your email. Enter it below to confirm the password change.');
      } else {
        setPasswordMessage(response?.message || 'OTP request sent. Check your email.');
      }
    } catch (err: any) {
      setPasswordMessage(err?.message || 'Unable to send OTP. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const verifyPasswordChange = async () => {
    if (!passwordOtpToken) return;
    setPasswordLoading(true);
    setPasswordMessage(null);
    try {
      const response = await authAPI.changePasswordWithOtp({
        otp_token: passwordOtpToken,
        code: passwordOtpCode,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      if (response?.token && response?.admin) {
        refreshSession(response.token, response.admin);
      }

      setPasswordStep('success');
      setPasswordMessage('Password updated successfully.');
      setPasswordOtpCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMessage(err?.message || 'Failed to update password. Please verify the OTP and try again.');
    } finally {
      setPasswordLoading(false);
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

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Secure your admin account with an OTP-protected password update.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {passwordMessage && (
            <div
              className={`rounded-md border p-3 text-sm ${
                passwordStep === 'success'
                  ? 'border-green-200 bg-green-50 text-green-800'
                  : 'border-blue-200 bg-blue-50 text-blue-800'
              }`}
            >
              {passwordMessage}
            </div>
          )}

          {passwordStep !== 'otp_sent' && passwordStep !== 'success' && (
            <Button onClick={requestPasswordChangeOtp} disabled={passwordLoading}>
              {passwordLoading ? 'Sending OTP…' : 'Send OTP to email'}
            </Button>
          )}

          {passwordStep === 'otp_sent' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">OTP Code</p>
                <InputOTP maxLength={6} value={passwordOtpCode} onChange={setPasswordOtpCode}>
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((slot) => (
                      <InputOTPSlot key={slot} index={slot} className="h-11 w-11 text-lg" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={verifyPasswordChange}
                  disabled={
                    passwordLoading ||
                    passwordOtpCode.length !== 6 ||
                    !newPassword ||
                    newPassword.length < 8 ||
                    newPassword !== confirmPassword
                  }
                >
                  {passwordLoading ? 'Updating…' : 'Verify & Update Password'}
                </Button>
                <Button variant="ghost" onClick={() => setPasswordStep('idle')} disabled={passwordLoading}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {passwordStep === 'success' && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              Password changed successfully. Use your new password for the next login.
            </div>
          )}
        </CardContent>
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
