import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Input from '../components/ui/Input';

const ROASTS = ['', 'Light', 'Medium', 'Medium-Dark', 'Dark'];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [roastLevel, setRoastLevel] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (roastLevel) params.roastLevel = roastLevel;

    api
      .get('/products', { params })
      .then(({ data }) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, roastLevel]);

  return (
    <div className="page-shell pb-20 pt-10">
      <p className="eyebrow">Shop</p>
      <h1 className="section-title mt-2">All coffee beans</h1>
      <p className="mt-2 text-sm text-muted">Prices in PHP · 250g bags</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_200px]">
        <Input
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search"
        />
        <select
          value={roastLevel}
          onChange={(e) => setRoastLevel(e.target.value)}
          className="border border-line bg-white px-4 py-3 text-sm outline-none focus:border-coffee"
        >
          {ROASTS.map((r) => (
            <option key={r || 'all'} value={r}>
              {r || 'All roasts'}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="mt-16 text-muted">Loading…</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <p className="mt-16 text-muted">No products match your filters.</p>
      )}
    </div>
  );
}