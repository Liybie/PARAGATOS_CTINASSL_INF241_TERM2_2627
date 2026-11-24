import { Link } from 'react-router-dom';
import { formatPHP } from '../utils/format';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { has, toggle } = useWishlist();
  const saved = has(product._id);

  return (
    <article className="group flex flex-col border border-line bg-white">
      <div className="relative aspect-[4/5] overflow-hidden bg-beige/30">
        <Link to={`/shop/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggle(product._id)}
          className="absolute top-3 right-3 text-[10px] tracking-widest text-white uppercase drop-shadow"
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="eyebrow">{product.origin}</p>
        <Link to={`/shop/${product._id}`} className="mt-1 text-base font-semibold hover:underline">
          {product.name}
        </Link>
        <p className="mt-1 text-xs text-muted">
          {product.roastLevel} · {product.weight}
        </p>
        <p className="mt-auto pt-3 text-base font-semibold">{formatPHP(product.price)}</p>
      </div>
    </article>
  );
}