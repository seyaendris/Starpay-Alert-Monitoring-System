'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, AlertCircle, RefreshCw, X } from 'lucide-react';

/* ------------------------------- Types ------------------------------- */
interface AlertReceiver {
  id: number;
  email: string;
  phone_number: string;
  level: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: AlertReceiver[];
}

/* --------------------------- Static Config --------------------------- */
// Use local proxy server instead of direct ngrok URL
// const API_BASE_URL = 'https://e55f605b72d2.ngrok-free.app';
const API_BASE_URL = 'https://pretty-jeans-build.loca.lt';
// static token requested
const AUTH_TOKEN =
  'eyJhbGciOiJIUzM4NCJ9.eyJpc3MiOiJzdGFycGF5LW1vbml0b3JpbmciLCJpYXQiOjE3NjI5MzcyMjYsImV4cCI6MTc2Mjk5NzIyNiwic3ViIjoiYWRtaW4iLCJyb2xlcyI6WyJhZG1pbiJdLCJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOiI5Iiwicm9sZSI6ImFkbWluIn0.X-mXp3ZZolKhWSv6loPSnJmSGcnXSuFbqFfZSnV9CK37elAHge0LcCE3ZJGvqUno';

const headers = {
  'Content-Type': 'application/json',
  "bypass-tunnel-reminder": "true",
  Authorization: `Bearer ${AUTH_TOKEN}`,
};

/* --------------------------- Helpers --------------------------- */
const formatDate = (epoch: string) => {
  const ms = Number(epoch);
  if (isNaN(ms)) return '-';
  return format(new Date(ms), 'dd MMM yyyy, HH:mm');
};

/* --------------------------- Toast (inline) --------------------------- */
type ToastType = 'success' | 'error' | 'info';
const useToast = () => {
  const [toasts, setToasts] = useState<{ id: number; message: string; type: ToastType }[]>([]);

  const addToast = (type: ToastType, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 p-3 rounded shadow-lg text-white animate-slide-in-right ${
            t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
          }`}
        >
          <span>{t.message}</span>
          <button onClick={() => setToasts((prev) => prev.filter((i) => i.id !== t.id))} className="ml-2">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );

  return { toast: addToast, ToastContainer };
};

/* --------------------------- Delete Dialog --------------------------- */
function DeleteDialog({
  open,
  onOpenChange,
  receiver,
  onConfirm,
  loading,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  receiver: AlertReceiver;
  onConfirm: () => void;
  loading: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-sm w-full p-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold">Confirm Delete</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete <strong>{receiver.email}</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={() => onOpenChange(false)} className="px-4 py-2 text-sm border rounded hover:bg-gray-50" disabled={loading}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Table Skeleton --------------------------- */
function TableSkeleton() {
  return (
    <div className="rounded-md border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            {['Email', 'Phone Number', 'Level', 'Created At', 'Updated At', 'Actions'].map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(4)].map((_, i) => (
            <tr key={i} className="border-b">
              {[...Array(6)].map((_, j) => (
                <td key={j} className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-full max-w-[180px] animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --------------------------- Main Page --------------------------- */
export default function AlertReceiversPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast, ToastContainer } = useToast();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching from:', `${API_BASE_URL}/api/v1/starpay-alert/user`);
      
      // Add mode: 'cors' and credentials: 'omit' for cross-origin requests
      const res = await fetch(`${API_BASE_URL}/api/v1/starpay-alert/user`, {
        method: 'GET',
        headers,
        mode: 'cors',
        credentials: 'omit',
      });
      
      // Check if response is OK
      if (!res.ok) {
        // Try to get error text, but handle potential non-text responses
        let errorText = 'Unknown error';
        try {
          errorText = await res.text();
        } catch {
          errorText = `HTTP ${res.status}: ${res.statusText}`;
        }
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      // Check content type to ensure it's JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        
        // Check if this is an ngrok error page
        if (text.includes('ngrok') || text.includes('ERR_NGROK')) {
          throw new Error('Ngrok tunnel error - check if the backend service is running and accessible');
        }
        
        throw new Error('Server returned non-JSON response');
      }

      const json: ApiResponse = await res.json();
      console.log('fetchData response body:', json);
      
      if (json.status !== '200') {
        throw new Error(json?.message || 'Failed to load');
      }
      
      setData(json);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('fetchData error:', err);
      toast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/starpay-alert/user?id=${deleteId}`, {
        method: 'DELETE',
        headers,
        mode: 'cors',
        credentials: 'omit',
      });
      
      if (!res.ok) {
        // Try to get error text, but handle potential non-text responses
        let errorText = 'Unknown error';
        try {
          errorText = await res.text();
        } catch {
          errorText = `HTTP ${res.status}: ${res.statusText}`;
        }
        console.error('Delete API Error Response:', errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Delete non-JSON response:', text);
        
        // Check if this is an ngrok error page
        if (text.includes('ngrok') || text.includes('ERR_NGROK')) {
          throw new Error('Ngrok tunnel error - check if the backend service is running and accessible');
        }
        
        throw new Error('Server returned non-JSON response');
      }

      const json = await res.json();
      console.log('handleDelete response body:', json);
      if (!res.ok) throw new Error(json?.message || 'Delete failed');
      toast('success', 'Receiver removed');
      await fetchData(); // refresh list
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      console.error('handleDelete error:', err);
      toast('error', errorMessage);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const receiverToDelete = data?.data.find((r) => r.id === deleteId);

  return (
    <>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Alert Receivers</h1>
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-600">
            <AlertCircle className="h-10 w-10 mb-3" />
            <p className="text-lg font-medium mb-4">{error}</p>
            <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50">
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        ) : (
          <div className="rounded-md border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Phone Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Level</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Created At</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Updated At</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                      No alert receivers found.
                    </td>
                  </tr>
                ) : (
                  data?.data.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{r.email}</td>
                      <td className="px-4 py-3">{r.phone_number}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">L{r.level}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">{formatDate(r.created_at)}</td>
                      <td className="px-4 py-3 text-sm">{formatDate(r.updated_at)}</td>
                      <td className="px-4 py-3 text-right space-x-1">
                        <button onClick={() => toast('info', 'Edit coming soon')} className="inline-flex items-center p-1 text-blue-700 hover:text-blue-900" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteId(r.id)} className="inline-flex items-center p-1 text-red-600 hover:text-red-800" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inline Delete Dialog */}
      {receiverToDelete && (
        <DeleteDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)} receiver={receiverToDelete} onConfirm={handleDelete} loading={deleting} />
      )}

      {/* Inline Toast Container */}
      <ToastContainer />

      {/* Tailwind Animation Keyframes */}
      <style jsx global>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
