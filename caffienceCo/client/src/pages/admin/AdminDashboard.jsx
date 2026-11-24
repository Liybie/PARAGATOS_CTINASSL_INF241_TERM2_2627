import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0, completed: 0 });

  useEffect(() => {
    Promise.all([api.get('/products/admin/all'), api.get('/orders')])
      .then(([productsRes, ordersRes]) => {
        const orders = ordersRes.data;
        setStats({
          products: productsRes.data.length,
          orders: orders.length,
          pending: orders.filter((o) => o.orderStatus === 'Pending').length,
          completed: orders.filter((o) => o.orderStatus === 'Delivered').length,
        });
      })
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Total products', value: stats.products },
    { label: 'Total orders', value: stats.orders },
    { label: 'Pending orders', value: stats.pending },
    { label: 'Completed orders', value: stats.completed },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-espresso">Dashboard</h1>
      <p className="mt-2 text-coffee/70">Caffeine.co operations overview</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="border border-coffee/10 bg-white p-6">
            <p className="text-xs tracking-widest text-roast uppercase">{c.label}</p>
            <p className="mt-2 text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}