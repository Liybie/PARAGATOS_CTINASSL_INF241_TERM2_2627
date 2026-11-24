import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { ids, toggle } = useWishlist();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then(({ data }) => {
      setProducts(data.filter((p) => ids.includes(p._id)));
    });
  }, [ids]);

  return (
    <div className="page-shell pb-20 pt-10">
      <p className="eyebrow">Saved</p>
      <h1 className="section-title mt-2">Wishlist</h1>

      {products.length === 0 ? (
        <div className="mt-12 text-center text-muted">
          <p>No saved items yet.</p>
          <Link to="/shop" className="mt-4 inline-block text-xs tracking-widest text-espresso uppercase underline">
            Browse shop
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p._id} className="relative">
              <ProductCard product={p} />
              <button
                type="button"
                onClick={() => toggle(p._id)}
                className="absolute right-3 top-3 text-xs text-muted underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}