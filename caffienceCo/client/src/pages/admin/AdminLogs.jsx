import { useEffect, useState } from 'react';
import api from '../../services/api';

function formatTime(date) {
  return new Date(date).toLocaleString('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

const actionStyle = {
  CREATE: 'text-green-800',
  UPDATE: 'text-amber-800',
  DELETE: 'text-red-800',
  LOGIN: 'text-blue-800',
  LOGOUT: 'text-muted',
  STATUS_CHANGE: 'text-roast',
};

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('/logs')
      .then(({ data }) => setLogs(data))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-espresso">Activity log</h1>
          <p className="mt-2 text-sm text-muted">Admin actions, product changes, and order updates.</p>
        </div>
        <button
          type="button"
          onClick={load}
          className="border border-line bg-white px-4 py-2 text-xs tracking-widest uppercase hover:border-coffee"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="mt-10 text-muted">Loading…</p>
      ) : logs.length === 0 ? (
        <p className="mt-10 text-muted">No activity yet. Logs appear after admin actions.</p>
      ) : (
        <div className="mt-8 max-h-[70vh] overflow-auto border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 border-b border-line bg-beige/50 text-[10px] tracking-widest uppercase">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Admin</th>
                <th className="p-3">Action</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b border-line/80 align-top">
                  <td className="p-3 whitespace-nowrap text-muted">{formatTime(log.createdAt)}</td>
                  <td className="p-3 font-medium">{log.adminUsername}</td>
                  <td className={`p-3 text-xs font-semibold tracking-wide uppercase ${actionStyle[log.action] || ''}`}>
                    {log.action}
                  </td>
                  <td className="p-3 text-coffee">
                    <span className="text-[10px] tracking-wide text-muted uppercase">{log.entity}</span>
                    <p className="mt-0.5">{log.summary}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}