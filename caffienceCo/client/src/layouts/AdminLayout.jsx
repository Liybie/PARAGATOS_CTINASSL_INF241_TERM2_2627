import { Link, NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { admin, loading, adminLogout } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-espresso text-cream">
        Loading…
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const navClass = ({ isActive }) =>
    `block rounded px-3 py-2 text-sm ${isActive ? 'bg-cream text-espresso' : 'text-cream/80 hover:bg-cream/10'}`;

  return (
    <div className="min-h-screen bg-coffee/10">
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        <aside className="w-56 shrink-0 rounded-lg bg-espresso p-5 text-cream">
          <div className="mb-8 flex items-center gap-2">
            <img src="/favicon.png" alt="" className="h-8 w-8" />
            <span className="text-sm font-bold">Admin</span>
          </div>
          <nav className="space-y-1">
            <NavLink to="/admin" end className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={navClass}>
              Products
            </NavLink>
            <NavLink to="/admin/orders" className={navClass}>
              Orders
            </NavLink>
            <NavLink to="/admin/logs" className={navClass}>
              Log
            </NavLink>
          </nav>
          <button
            type="button"
            onClick={adminLogout}
            className="mt-8 w-full border border-cream/30 py-2 text-xs tracking-widest uppercase hover:bg-cream/10"
          >
            Logout
          </button>
          <Link to="/" className="mt-4 block text-center text-xs text-cream/50 hover:text-cream">
            ← Storefront
          </Link>
        </aside>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}