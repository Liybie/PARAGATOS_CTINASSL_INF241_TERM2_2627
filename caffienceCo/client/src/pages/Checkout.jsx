import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { formatPHP } from '../utils/format';

const FIELDS = [
  { name: 'customerName', label: 'Full name', fromUser: 'fullName' },
  { name: 'email', label: 'Email', type: 'email', fromUser: 'email', readOnlyWhenUser: true },
  { name: 'contactNumber', label: 'Contact number', fromUser: 'contactNumber' },
  { name: 'deliveryAddress', label: 'Delivery address', fromUser: 'deliveryAddress' },
  { name: 'city', label: 'City', fromUser: 'city' },
  { name: 'postalCode', label: 'Postal code', fromUser: 'postalCode' },
];

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    contactNumber: '',
    deliveryAddress: '',
    city: '',
    postalCode: '',
  });

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
  }, [items.length, navigate]);

  useEffect(() => {
    if (!user) return;
    setForm({
      customerName: user.fullName || '',
      email: user.email || '',
      contactNumber: user.contactNumber || '',
      deliveryAddress: user.deliveryAddress || '',
      city: user.city || '',
      postalCode: user.postalCode || '',
    });
  }, [user]);

  if (items.length === 0) return null;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      };
      const { data } = await api.post('/orders', payload);
      clearCart();
      navigate(`/order-confirmation/${data.orderNumber}`, { state: { order: data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell pb-20 pt-10">
      <p className="eyebrow">Checkout</p>
      <h1 className="section-title mt-2">Delivery details</h1>
      <p className="mt-2 text-sm text-muted">
        {user ? 'Signed in · Cash on Delivery' : (
          <>
            Guest checkout ·{' '}
            <Link to="/login" className="text-espresso underline">
              Login
            </Link>{' '}
            to pre-fill details
          </>
        )}
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 border border-line bg-white p-6">
          {FIELDS.map(({ name, label, type = 'text', readOnlyWhenUser }) => (
            <Input
              key={name}
              label={label}
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              required
              readOnly={readOnlyWhenUser && user}
            />
          ))}
          {error && <p className="text-sm text-red-700">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Placing order…' : 'Place order (COD)'}
          </Button>
        </form>

        <div className="border border-line bg-white p-6">
          <h2 className="text-sm font-semibold">Order summary</h2>
          <ul className="mt-4 space-y-2 text-sm text-coffee">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between">
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>{formatPHP(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-line pt-4 text-lg font-semibold">
            Total {formatPHP(subtotal)}
          </p>
        </div>
      </div>
    </div>
  );
}