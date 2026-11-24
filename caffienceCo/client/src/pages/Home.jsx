import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2000&q=80';

const perks = [
  { title: 'Specialty grade', detail: 'Eight single-origin beans, 250g.' },
  { title: 'Cash on delivery', detail: 'Pay when your order arrives.' },
  { title: 'Track anytime', detail: 'Reference number plus email lookup.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/products').then(({ data }) => setFeatured(data.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/70 to-espresso/25" />

        <div className="page-shell relative z-10 flex min-h-[calc(100vh-4rem)] flex-col justify-end pb-14 pt-10 sm:pb-20">
          <p className="text-[11px] font-medium tracking-[0.28em] text-cream/75 uppercase">
            Est. 2020 · Artisan roasters
          </p>

          <div className="mt-6 max-w-xl">
            <div className="flex items-center gap-3">
              <img src="/favicon.png" alt="" className="h-11 w-11" />
              <span className="text-xl font-semibold tracking-tight text-cream">Caffeine.co</span>
            </div>
            <p className="font-serif mt-5 text-2xl leading-snug text-cream sm:text-3xl">
              Brewed for Every Day.
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/80">
              Small-batch coffee beans delivered across the Philippines. Create an account to save
              your details and view past orders.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="bg-cream px-8 py-3.5 text-xs font-semibold tracking-widest text-espresso uppercase"
            >
              Shop beans
            </Link>
            {user && (
              <Link
                to="/account"
                className="border border-cream/45 px-8 py-3.5 text-xs font-semibold tracking-widest text-cream uppercase hover:bg-cream/10"
              >
                My account
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="bg-cream">
      <section className="border-b border-line bg-white py-12">
        <div className="page-shell grid gap-8 sm:grid-cols-3">
          {perks.map((item) => (
            <Perk key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section className="page-shell py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Featured</p>
            <h2 className="section-title mt-2">Shop the lineup</h2>
          </div>
          <Link
            to="/shop"
            className="hidden text-[11px] tracking-widest text-muted uppercase hover:text-espresso sm:inline"
          >
            View all
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      <section id="about" className="border-t border-line bg-white py-20">
        <div className="page-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="order-2 lg:order-1">
            <p className="eyebrow text-roast">About</p>
            <h2 className="section-title mt-2 text-espresso">Roasted with restraint</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-coffee">
              We source transparently and roast in small batches so origin notes stay clear in the
              cup. Sign in to save delivery details, view orders, and check out faster.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <Link to="/account">
                  <Button>My account</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button>Sign in</Button>
                  </Link>
                  <Link to="/login?mode=signup">
                    <Button variant="secondary">Create account</Button>
                  </Link>
                </>
              )}
              <Link to="/shop">
                <Button variant="ghost">Browse shop</Button>
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80"
              alt="Roasted coffee beans"
              className="aspect-[5/4] w-full border border-line object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      </div>
    </>
  );
}

function Perk({ title, detail }) {
  return (
    <div>
      <p className="text-sm font-semibold text-espresso">{title}</p>
      <p className="mt-1 text-sm text-muted">{detail}</p>
    </div>
  );
}
