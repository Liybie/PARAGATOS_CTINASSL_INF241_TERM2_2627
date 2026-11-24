import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const formatPHP = (n) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n);

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  const load = () => {
    api.get('/products/admin/all').then(({ data }) => setProducts(data));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-espresso px-5 py-2 text-xs tracking-widest text-cream uppercase"
        >
          Add product
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto border border-coffee/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-coffee/10 bg-beige/30 text-xs tracking-widest uppercase">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Active</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-coffee/5">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">{formatPHP(p.price)}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">{p.isActive ? 'Yes' : 'No'}</td>
                <td className="p-4 space-x-3">
                  <Link to={`/admin/products/${p._id}/edit`} className="text-roast underline">
                    Edit
                  </Link>
                  <button type="button" onClick={() => handleDelete(p._id)} className="text-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}