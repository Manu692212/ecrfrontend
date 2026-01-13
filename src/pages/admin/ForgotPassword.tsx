import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

type Step = 'request' | 'verify' | 'success';

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const navigate = useNavigate();
  const { refreshSession } = useAuth();

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const response = await authAPI.requestPasswordReset(email);
      if (response?.otp_token) {
        setOtpToken(response.otp_token);
        setInfo('OTP sent to your registered email. Enter it below to reset your password.');
        setStep('verify');
      } else if (response?.message) {
        setInfo(response.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.resetPassword({
        email,
        otp_token: otpToken,
        code,
        password,
        password_confirmation: passwordConfirmation,
      });
      if (response?.token && response?.admin) {
        refreshSession(response.token, response.admin);
      }
      setStep('success');
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password. Please check the OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderAlert = () => {
    if (error) {
      return (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-100">
          {error}
        </div>
      );
    }

    if (info) {
      return (
        <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700 border border-blue-100">
          {info}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">ECR Admin</p>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {step === 'request' && 'Forgot your password?'}
            {step === 'verify' && 'Verify OTP'}
            {step === 'success' && 'Password reset successful'}
          </h2>
          <p className="text-sm text-gray-600">
            {step === 'request' && 'Enter your admin email to receive a one-time password.'}
            {step === 'verify' && 'Enter the OTP sent to your email and choose a new password.'}
            {step === 'success' && 'You can now sign in with your new password.'}
          </p>
        </div>

        {renderAlert()}

        {step === 'request' && (
          <form className="space-y-6" onSubmit={handleRequest}>
            <div className="space-y-2">
              <Label htmlFor="reset-email">Admin email</Label>
              <Input
                id="reset-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@institution.com"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Remembered your password?{' '}
              <Link to="/admin/login" className="font-medium text-primary hover:underline">
                Go back to login
              </Link>
            </p>
          </form>
        )}

        {step === 'verify' && (
          <form className="space-y-6" onSubmit={handleVerify}>
            <div className="text-sm text-muted-foreground text-center">
              OTP sent to <span className="font-semibold">{email}</span>
            </div>
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup className="mx-auto">
                {[0, 1, 2, 3, 4, 5].map((slot) => (
                  <InputOTPSlot key={slot} index={slot} className="w-12 h-12 text-lg" />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || code.length !== 6 || password.length < 8 || password !== passwordConfirmation}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Entered the wrong email?{' '}
              <button type="button" className="font-medium text-primary hover:underline" onClick={() => setStep('request')}>
                Start over
              </button>
            </p>
          </form>
        )}

        {step === 'success' && (
          <div className="space-y-6 text-center">
            <div className="rounded-2xl bg-green-50 p-6 text-green-800">
              Your password has been reset successfully.
            </div>
            <Button className="w-full" onClick={() => navigate('/admin/home')}>
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
