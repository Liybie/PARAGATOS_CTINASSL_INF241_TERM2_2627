import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const { user, signIn, signUp, adminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    contactNumber: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [mode]);

  if (user) {
    return <Navigate to={location.state?.from || '/account'} replace />;
  }

  const setMode = (next) => {
    if (next === 'signup') setSearchParams({ mode: 'signup' }, { replace: true });
    else setSearchParams({}, { replace: true });
  };

  const redirectAfterAuth = () => navigate(location.state?.from || '/account');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const value = identifier.trim();
    try {
      if (value.includes('@')) {
        await signIn(value, password);
        redirectAfterAuth();
      } else {
        await adminLogin(value, password);
        navigate('/admin');
      }
    } catch {
      setError('Invalid email, username, or password');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signUp(form);
      redirectAfterAuth();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account');
    }
  };

  const handleSignupChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <div className="border border-line bg-white p-8 sm:p-10">
      <p className="eyebrow">Account</p>
      <h1 className="section-title mt-2">Login</h1>
      <p className="mt-2 text-sm text-muted">
        {mode === 'login'
          ? 'Sign in to view orders and saved delivery details.'
          : 'Create an account for faster checkout.'}
      </p>

      <div className="mt-8 flex items-stretch text-[11px] font-medium tracking-[0.2em] uppercase">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 py-3 transition ${
            mode === 'login'
              ? 'border border-espresso bg-espresso text-cream'
              : 'border border-line bg-cream text-muted hover:text-espresso'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`flex-1 py-3 transition ${
            mode === 'signup'
              ? 'border border-espresso bg-espresso text-cream'
              : 'border border-line border-l-0 bg-cream text-muted hover:text-espresso'
          }`}
        >
          Sign up
        </button>
      </div>

      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <Input
            label="Email or username"
            name="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            autoComplete="username"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="mt-8 space-y-4">
          <Input
            label="Full name"
            name="fullName"
            value={form.fullName}
            onChange={handleSignupChange}
            required
          />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleSignupChange}
          required
          inputMode="email"
        />
          <Input
            label="Phone (optional)"
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleSignupChange}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleSignupChange}
            required
            minLength={8}
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
      )}
    </div>
  );
}