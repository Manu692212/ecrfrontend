import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const SMTP_FIELDS = [
  {
    key: 'smtp.mailer',
    label: 'Mailer',
    placeholder: 'smtp',
    description: 'transport driver name',
  },
  {
    key: 'smtp.resend_api_key',
    label: 'Resend API Key',
    placeholder: 're_XXXXXXXXXXXX',
    type: 'password',
    description: 'Resend API key (required when using resend)',
  },
  {
    key: 'smtp.host',
    label: 'Host',
    placeholder: 'smtp.mailtrap.io',
    description: 'SMTP host address',
  },
  {
    key: 'smtp.port',
    label: 'Port',
    placeholder: '587',
    description: 'SMTP port',
  },
  {
    key: 'smtp.username',
    label: 'Username',
    placeholder: 'SMTP username',
    description: 'SMTP account username',
  },
  {
    key: 'smtp.password',
    label: 'Password',
    placeholder: 'SMTP password',
    type: 'password',
    description: 'SMTP account password',
  },
  {
    key: 'smtp.encryption',
    label: 'Encryption',
    placeholder: 'tls / ssl',
    description: 'Encryption protocol',
  },
  {
    key: 'smtp.from_address',
    label: 'Sender Address',
    placeholder: 'no-reply@ecracademy.com',
    description: 'From email address',
  },
  {
    key: 'smtp.from_name',
    label: 'Sender Name',
    placeholder: 'ECR Academy',
    description: 'Display name for outgoing mail',
  },
  {
    key: 'smtp.recipient_address',
    label: 'Notification Recipient',
    placeholder: 'admissions@ecracademy.com',
    description: 'Default recipient for application emails',
  },
  {
    key: 'smtp.recipient_name',
    label: 'Recipient Name',
    placeholder: 'Admissions Desk',
    description: 'Display name for notification recipient',
  },
] as const;

const MAILER_OPTIONS = [
  { value: 'smtp', label: 'SMTP' },
  { value: 'resend', label: 'Resend' },
  { value: 'log', label: 'Log (disable sending)' },
] as const;

type SmtpSettingKey = (typeof SMTP_FIELDS)[number]['key'];

const SMTP_KEYS: SmtpSettingKey[] = SMTP_FIELDS.map((field) => field.key);

const buildInitialSmtpValues = () =>
  SMTP_FIELDS.reduce(
    (acc, field) => {
      acc[field.key] = '';
      return acc;
    },
    {} as Record<SmtpSettingKey, string>
  );

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
  const [smtpValues, setSmtpValues] = useState<Record<SmtpSettingKey, string>>(buildInitialSmtpValues);
  const [smtpSettingsMap, setSmtpSettingsMap] = useState<Partial<Record<SmtpSettingKey, Setting>>>({});
  const [smtpLoading, setSmtpLoading] = useState(true);
  const [smtpSaving, setSmtpSaving] = useState(false);
  const [smtpError, setSmtpError] = useState<string | null>(null);
  const [smtpMessage, setSmtpMessage] = useState<string | null>(null);
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

  const loadSmtpSettings = useCallback(async () => {
    setSmtpLoading(true);
    setSmtpError(null);
    try {
      const response: Setting[] = await settingsAPI.getGroup('smtp');
      const keyedSettings: Partial<Record<SmtpSettingKey, Setting>> = {};
      const nextValues = buildInitialSmtpValues();

      response?.forEach((setting) => {
        if (SMTP_KEYS.includes(setting.key as SmtpSettingKey)) {
          const key = setting.key as SmtpSettingKey;
          keyedSettings[key] = setting;
          nextValues[key] = setting.value ?? '';
        }
      });

      setSmtpSettingsMap(keyedSettings);
      setSmtpValues(nextValues);
    } catch (err: any) {
      setSmtpError(err?.message || 'Unable to load SMTP settings');
    } finally {
      setSmtpLoading(false);
    }
  }, []);

  const handleSmtpInputChange = (key: SmtpSettingKey, value: string) => {
    setSmtpValues((prev) => ({ ...prev, [key]: value }));
  };

  const saveSmtpSettings = async () => {
    setSmtpSaving(true);
    setSmtpMessage(null);
    setSmtpError(null);
    try {
      await Promise.all(
        SMTP_FIELDS.map(async (field) => {
          let value = smtpValues[field.key] ?? '';
          if (field.key === 'smtp.mailer') {
            const normalized = value.trim();
            value = normalized !== '' ? normalized : 'smtp';
          }
          const existing = smtpSettingsMap[field.key];

          if (existing) {
            await settingsAPI.update(existing.id, { value });
          } else {
            await settingsAPI.create({
              key: field.key,
              value,
              type: 'text',
              group: 'smtp',
              description: field.description,
              is_public: false,
            });
          }
        })
      );

      setSmtpMessage('SMTP settings saved successfully.');
      await loadSmtpSettings();
    } catch (err: any) {
      setSmtpError(err?.message || 'Unable to save SMTP settings');
    } finally {
      setSmtpSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings(page);
  }, [page]);

  useEffect(() => {
    loadSmtpSettings();
  }, [loadSmtpSettings]);

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
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>SMTP & Mail</CardTitle>
              <CardDescription>Configure mail transport used for OTPs and public submissions.</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={loadSmtpSettings} disabled={smtpLoading || smtpSaving}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {smtpError && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {smtpError}
            </div>
          )}
          {smtpMessage && (
            <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              {smtpMessage}
            </div>
          )}
          {smtpLoading ? (
            <p className="text-sm text-muted-foreground">Loading SMTP settings...</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {SMTP_FIELDS.map((field) => {
                const activeMailer = (smtpValues['smtp.mailer'] ?? '').trim() || 'smtp';

                const smtpOnlyKeys: SmtpSettingKey[] = [
                  'smtp.host',
                  'smtp.port',
                  'smtp.username',
                  'smtp.password',
                  'smtp.encryption',
                ];

                if (smtpOnlyKeys.includes(field.key) && activeMailer !== 'smtp') {
                  return null;
                }

                if (field.key === 'smtp.resend_api_key' && activeMailer !== 'resend') {
                  return null;
                }

                return (
                  <div key={field.key} className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{field.label}</label>
                    {field.key === 'smtp.mailer' ? (
                      <Select value={activeMailer} onValueChange={(value) => handleSmtpInputChange('smtp.mailer', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {MAILER_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={field.type ?? 'text'}
                        value={smtpValues[field.key] ?? ''}
                        onChange={(event) => handleSmtpInputChange(field.key, event.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            These credentials power OTP delivery and submission notifications. Keep them private.
          </p>
          <Button onClick={saveSmtpSettings} disabled={smtpSaving || smtpLoading}>
            {smtpSaving ? 'Saving SMTP…' : 'Save SMTP Settings'}
          </Button>
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
