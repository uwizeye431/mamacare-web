import { API_URL } from '../../lib/api';

export class AdminApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

// Calls an admin endpoint with the session cookie; throws AdminApiError with the API's message
export const adminApi = async <T = unknown>(path: string, init: { method?: string; body?: object } = {}): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/admin${path}`, {
      method: init.method ?? 'GET',
      credentials: 'include',
      headers: init.body ? { 'Content-Type': 'application/json' } : undefined,
      body: init.body ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw new AdminApiError('Cannot reach the MamaCare server.', 0);
  }
  if (response.status === 204) return undefined as T;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new AdminApiError(data.error || 'Request failed.', response.status);
  return data as T;
};

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
