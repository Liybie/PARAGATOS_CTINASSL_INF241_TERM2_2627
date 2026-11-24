import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import { formatPHP } from '../utils/format';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setProduct(null));
  }, [id]);

  if (!product) {
    return (
      <div className="page-shell py-32 text-center text-muted">
        Product not found.{' '}
        <Link to="/shop" className="text-espresso underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    if (qty > product.stock) {
      setMessage(`Only ${product.stock} in stock`);
      return;
    }
    addItem(product, qty);
    setMessage('Added to cart');
  };

  return (
    <div className="page-shell pb-20 pt-10">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden border border-line bg-beige/20">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="eyebrow">{product.origin}</p>
          <h1 className="section-title mt-2">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold">{formatPHP(product.price)}</p>
          <p className="mt-6 text-sm leading-relaxed text-coffee">{product.description}</p>
          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="eyebrow">Roast</dt>
              <dd className="mt-1 font-medium">{product.roastLevel}</dd>
            </div>
            <div>
              <dt className="eyebrow">Weight</dt>
              <dd className="mt-1 font-medium">{product.weight}</dd>
            </div>
            <div>
              <dt className="eyebrow">Stock</dt>
              <dd className="mt-1 font-medium">
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex items-center gap-3">
            <label className="eyebrow" htmlFor="qty">
              Qty
            </label>
            <input
              id="qty"
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-20 border border-line px-3 py-2 text-sm"
            />
          </div>

          <Button
            type="button"
            disabled={product.stock < 1}
            onClick={handleAdd}
            className="mt-6 w-full"
          >
            Add to cart
          </Button>
          {message && <p className="mt-3 text-sm text-roast">{message}</p>}
        </div>
      </div>
    </div>
  );
}