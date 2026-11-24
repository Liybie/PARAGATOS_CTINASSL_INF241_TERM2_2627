import { useState } from 'react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { formatPHP } from '../utils/format';

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    try {
      const { data } = await api.post('/orders/track', { orderNumber, email });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found');
    }
  };

  return (
    <div className="page-shell max-w-xl pb-20 pt-10">
      <p className="eyebrow">Orders</p>
      <h1 className="section-title mt-2">Track order</h1>
      <p className="mt-2 text-sm text-muted">Enter your reference number and checkout email.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 border border-line bg-white p-6">
        <Input
          label="Order reference"
          name="orderNumber"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          required
          placeholder="CC-YYYYMMDD-1234"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Button type="submit">Track</Button>
      </form>

      {result && (
        <div className="mt-8 border border-line bg-white p-6 text-sm">
          <p className="font-semibold">{result.orderNumber}</p>
          <p className="mt-2 text-muted">Status: {result.orderStatus}</p>
          <p className="mt-1">Total: {formatPHP(result.total)}</p>
          <ul className="mt-4 space-y-1 text-coffee">
            {result.items.map((item, i) => (
              <li key={i}>
                {item.name} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}