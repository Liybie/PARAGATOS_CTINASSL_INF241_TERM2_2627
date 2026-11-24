import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const ROASTS = ['Light', 'Medium', 'Medium-Dark', 'Dark'];
const empty = {
  name: '',
  description: '',
  price: '',
  image: '',
  origin: '',
  roastLevel: 'Medium',
  weight: '250g',
  stock: '',
  isActive: true,
};

function Field({ name, kind, value, onChange }) {
  const label = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-roast">{label}</label>
      {kind === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required
          rows={4}
          className="mt-1 w-full border px-4 py-3"
        />
      ) : (
        <input
          name={name}
          type={kind}
          value={value}
          onChange={onChange}
          required
          className="mt-1 w-full border px-4 py-3"
        />
      )}
    </div>
  );
}

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get('/products/admin/all').then(({ data }) => {
        const product = data.find((p) => p._id === id);
        if (!product) return;
        setForm({
          name: product.name,
          description: product.description,
          price: String(product.price),
          image: product.image,
          origin: product.origin,
          roastLevel: product.roastLevel,
          weight: product.weight,
          stock: String(product.stock),
          isActive: product.isActive,
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">{isEdit ? 'Edit product' : 'New product'}</h1>
      <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-4">
        <Field name="name" kind="text" value={form.name} onChange={handleChange} />
        <Field name="description" kind="textarea" value={form.description} onChange={handleChange} />
        <Field name="price" kind="number" value={form.price} onChange={handleChange} />
        <Field name="image" kind="text" value={form.image} onChange={handleChange} />
        <Field name="origin" kind="text" value={form.origin} onChange={handleChange} />
        <Field name="weight" kind="text" value={form.weight} onChange={handleChange} />
        <Field name="stock" kind="number" value={form.stock} onChange={handleChange} />
        <div>
          <label className="text-xs uppercase tracking-widest text-roast">Roast level</label>
          <select
            name="roastLevel"
            value={form.roastLevel}
            onChange={handleChange}
            className="mt-1 w-full border px-4 py-3"
          >
            {ROASTS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
          Active on storefront
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" className="bg-espresso px-8 py-3 text-xs tracking-widest text-cream uppercase">
          Save
        </button>
      </form>
    </div>
  );
}