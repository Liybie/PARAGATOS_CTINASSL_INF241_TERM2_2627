import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function AdminLogin() {
  const { admin, adminLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (admin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminLogin(username, password);
    } catch {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-white">
        <div className="page-shell flex h-16 items-center justify-between">
          <span className="text-sm font-bold">Admin</span>
          <Link to="/" className="text-[11px] tracking-widest text-muted uppercase">
            Storefront
          </Link>
        </div>
      </header>
      <main className="page-shell flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md border border-line bg-white p-8">
          <p className="eyebrow">Staff only</p>
          <h1 className="section-title mt-2">Admin login</h1>
          <div className="mt-8 space-y-4">
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-700">{error}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}