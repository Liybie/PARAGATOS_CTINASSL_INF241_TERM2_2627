import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { formatPHP } from '../utils/format';

function OrdersPanel({ orders }) {
  return (
    <div className="border border-line bg-white p-6">
      <h2 className="text-sm font-semibold tracking-wide">Order history</h2>
      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No orders yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {orders.map((o) => (
            <li key={o._id} className="flex items-center justify-between py-4 text-sm">
              <div>
                <p className="font-medium">{o.orderNumber}</p>
                <p className="text-muted">{o.orderStatus}</p>
              </div>
              <span>{formatPHP(o.total)}</span>
            </li>
          ))}
        </ul>
      )}
      <Link to="/shop" className="mt-4 inline-block text-xs tracking-widest text-espresso uppercase underline">
        Shop beans
      </Link>
    </div>
  );
}

export default function Account() {
  const { user, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.fullName,
      contactNumber: user.contactNumber,
      deliveryAddress: user.deliveryAddress,
      city: user.city,
      postalCode: user.postalCode,
    });
    api.get('/orders/my').then(({ data }) => setOrders(data)).catch(() => {});
  }, [user]);

  if (!form) return null;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile(form);
    setSaved(true);
  };

  return (
    <div className="page-shell pb-20 pt-10">
      <p className="eyebrow">Your account</p>
      <h1 className="section-title mt-2">Hi, {user.fullName.split(' ')[0]}</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <form onSubmit={handleSave} className="space-y-4 border border-line bg-white p-6">
          <h2 className="text-sm font-semibold tracking-wide">Profile & delivery</h2>
          {['fullName', 'contactNumber', 'deliveryAddress', 'city', 'postalCode'].map((name) => (
            <Input
              key={name}
              label={name.replace(/([A-Z])/g, ' $1')}
              name={name}
              value={form[name]}
              onChange={handleChange}
              required={name === 'fullName'}
            />
          ))}
          <p className="text-xs text-muted">{user.email}</p>
          {saved && <p className="text-sm text-roast">Saved.</p>}
          <Button type="submit" variant="secondary">
            Save details
          </Button>
        </form>
        <OrdersPanel orders={orders} />
      </div>
    </div>
  );
}