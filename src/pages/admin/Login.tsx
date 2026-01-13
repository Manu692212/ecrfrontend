import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const { login, verifyLoginOtp, pendingOtp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (pendingOtp && step !== 'otp') {
      setStep('otp');
    }
  }, [pendingOtp, step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success && result.requiresOtp) {
        setStep('otp');
      } else if (result.success) {
        navigate('/admin/home');
      } else {
        setError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOtpLoading(true);

    try {
      const success = await verifyLoginOtp(otpCode);
      if (success) {
        navigate('/admin/home');
      } else {
        setError('Invalid or expired OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
      console.error('OTP verify error:', err);
    } finally {
      setOtpLoading(false);
    }
  };

  const renderError = () =>
    error && (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );

  const renderCredentialForm = () => (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4 rounded-md shadow-sm">
        <div>
          <Label htmlFor="email-address">Email address</Label>
          <Input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
            placeholder="Email address"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
            placeholder="Password"
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div className="text-sm">
          <Link to="/admin/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
            Forgot your password?
          </Link>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Continue'
        )}
      </Button>
    </form>
  );

  const renderOtpForm = () => (
    <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to <span className="font-semibold">{pendingOtp?.email}</span>
        </p>
        <InputOTP maxLength={6} value={otpCode} onChange={(value) => setOtpCode(value)}>
          <InputOTPGroup className="mx-auto">
            {[0, 1, 2, 3, 4, 5].map((slot) => (
              <InputOTPSlot key={slot} index={slot} className="w-12 h-12 text-lg" />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button type="submit" className="w-full" disabled={otpLoading || otpCode.length !== 6}>
        {otpLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying OTP...
          </>
        ) : (
          'Verify & Sign in'
        )}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Didn&apos;t receive the code?{' '}
        <button
          type="button"
          className="font-semibold text-primary hover:underline disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          Resend OTP
        </button>
      </p>
    </form>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">ECR Admin</p>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {step === 'credentials' ? 'Sign in to admin panel' : 'Verify your identity'}
          </h2>
          <p className="text-sm text-gray-600">
            {step === 'credentials'
              ? 'Enter your credentials to access the dashboard'
              : 'Enter the OTP sent to your registered email'}
          </p>
        </div>

        {renderError()}

        {step === 'credentials' ? renderCredentialForm() : renderOtpForm()}

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Having trouble?{' '}
            <a href="mailto:support@example.com" className="font-medium text-blue-600 hover:text-blue-500">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
