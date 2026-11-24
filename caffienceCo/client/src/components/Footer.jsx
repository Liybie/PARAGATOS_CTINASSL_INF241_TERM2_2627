import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="page-shell grid gap-10 py-14 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold">Caffeine.co</p>
          <p className="font-serif mt-2 text-lg text-muted italic">Brewed for Every Day.</p>
        </div>
        <div className="space-y-2 text-sm text-coffee">
          <p className="eyebrow">Shop</p>
          <Link to="/shop" className="block hover:text-espresso">
            All beans
          </Link>
          <Link to="/wishlist" className="block hover:text-espresso">
            Wishlist
          </Link>
        </div>
        <div className="space-y-2 text-sm text-coffee">
          <p className="eyebrow">Account</p>
          <Link to="/login" className="block hover:text-espresso">
            Login
          </Link>
          <Link to="/admin/login" className="block text-muted hover:text-espresso">
            Admin login
          </Link>
        </div>
      </div>
      <div className="border-t border-line py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Caffeine.co
      </div>
    </footer>
  );
}