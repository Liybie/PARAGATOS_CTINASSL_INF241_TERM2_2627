import { useEffect, useState } from 'react';
import api from '../../services/api';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const formatPHP = (n) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n);

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => {
    api.get('/orders').then(({ data }) => setOrders(data));
  };

  useEffect(() => {
    load();
  }, []);

  const openOrder = async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    setSelected(data);
  };

  const updateStatus = async (status) => {
    if (!selected) return;
    await api.patch(`/orders/${selected._id}/status`, { orderStatus: status });
    const { data } = await api.get(`/orders/${selected._id}`);
    setSelected(data);
    load();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Orders</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <OrdersTable orders={orders} onSelect={openOrder} formatPHP={formatPHP} />
        {selected && (
          <div className="border border-coffee/10 bg-white p-6">
            <h2 className="font-bold">{selected.orderNumber}</h2>
            <p className="mt-2 text-sm text-coffee/70">
              {selected.customerName} · {selected.email}
            </p>
            <p className="text-sm">{selected.deliveryAddress}, {selected.city} {selected.postalCode}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {selected.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity} — {formatPHP(item.price * item.quantity)}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-bold">Total: {formatPHP(selected.total)}</p>
            <p className="mt-2 text-sm">Status: {selected.orderStatus}</p>
            <select
              className="mt-4 w-full border px-3 py-2 text-sm"
              value={selected.orderStatus}
              onChange={(e) => updateStatus(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersTable({ orders, onSelect, formatPHP }) {
  return (
    <div className="overflow-x-auto border border-coffee/10 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-beige/30 text-xs uppercase tracking-widest">
          <tr>
            <th className="p-3">Order</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Total</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr
              key={o._id}
              className="cursor-pointer border-b hover:bg-beige/20"
              onClick={() => onSelect(o._id)}
            >
              <td className="p-3 font-medium">{o.orderNumber}</td>
              <td className="p-3">{o.customerName}</td>
              <td className="p-3">{formatPHP(o.total)}</td>
              <td className="p-3">{o.orderStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
