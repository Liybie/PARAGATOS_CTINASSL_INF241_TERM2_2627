import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import { formatPHP } from '../utils/format';

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="page-shell py-32 text-center">
        <h1 className="section-title">Your cart is empty</h1>
        <Link to="/shop" className="mt-8 inline-block">
          <Button variant="secondary">Continue shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell pb-20 pt-10">
      <p className="eyebrow">Cart</p>
      <h1 className="section-title mt-2">{items.length} items</h1>

      <ul className="mt-8 divide-y divide-line border border-line bg-white">
        {items.map((item) => (
          <li key={item.productId} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <img src={item.image} alt="" className="h-20 w-20 object-cover" />
            <div className="flex-1">
              <h2 className="font-medium">{item.name}</h2>
              <p className="text-sm text-muted">{formatPHP(item.price)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="h-8 w-8 border border-line"
                disabled={item.quantity <= 1}
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="h-8 w-8 border border-line"
              >
                +
              </button>
            </div>
            <p className="font-medium">{formatPHP(item.price * item.quantity)}</p>
            <button
              type="button"
              onClick={() => removeItem(item.productId)}
              className="text-xs text-muted underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-end gap-4">
        <p className="text-xl font-semibold">Subtotal {formatPHP(subtotal)}</p>
        <Link to="/checkout">
          <Button>Checkout</Button>
        </Link>
      </div>
    </div>
  );
}