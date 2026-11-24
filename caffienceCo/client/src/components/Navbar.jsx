import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const navLink = ({ isActive }) =>
  `text-[11px] tracking-[0.18em] uppercase transition ${
    isActive ? 'text-espresso' : 'text-muted hover:text-espresso'
  }`;

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/95 backdrop-blur-sm">
      <div className="page-shell flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/favicon.png" alt="" className="h-9 w-9" />
          <span className="text-sm font-bold tracking-tight">Caffeine.co</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navLink}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLink}>
            Shop
          </NavLink>
          <NavLink to="/track-order" className={navLink}>
            Track
          </NavLink>
        </nav>

        <div className="flex items-center gap-4 text-[11px] tracking-[0.14em] text-muted uppercase sm:gap-5">
          <Link to="/wishlist" className="hidden hover:text-espresso sm:inline">
            Wishlist
          </Link>
          <Link to="/cart" className="relative hover:text-espresso">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2.5 -right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-espresso px-1 text-[9px] font-bold text-cream">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/account" className="hidden hover:text-espresso sm:inline">
                Account
              </Link>
              <button type="button" onClick={signOut} className="hover:text-espresso">
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="border border-espresso px-4 py-1.5 text-espresso hover:bg-espresso hover:text-cream"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}