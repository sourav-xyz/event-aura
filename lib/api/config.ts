const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
  data?: Record<string, unknown>;
}

// Make `api` a callable function and attach helper methods (.get, .post, .put, .delete)
type ApiCallable = {
  <T>(endpoint: string, options?: FetchOptions): Promise<T>;
  get: <T>(endpoint: string, options?: FetchOptions) => Promise<T>;
  post: <T>(endpoint: string, data?: Record<string, unknown>, options?: FetchOptions) => Promise<T>;
  put: <T>(endpoint: string, data?: Record<string, unknown>, options?: FetchOptions) => Promise<T>;
  delete: <T>(endpoint: string, options?: FetchOptions) => Promise<T>;
};

const api: ApiCallable = (async function <T>(endpoint: string, options: FetchOptions = {}) {
  const { data, ...customOptions } = options;

  const config: RequestInit = {
    ...customOptions,
    headers: {
      'Content-Type': 'application/json',
      ...customOptions.headers,
    },
    credentials: 'include', // Include cookies
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || 'Something went wrong');
  }

  return json as T;
}) as unknown as ApiCallable;

api.get = (endpoint, options = {}) => api(endpoint, { method: 'GET', ...options });
api.post = (endpoint, data = {}, options = {}) => api(endpoint, { method: 'POST', data, ...options });
api.put = (endpoint, data = {}, options = {}) => api(endpoint, { method: 'PUT', data, ...options });
api.delete = (endpoint, options = {}) => api(endpoint, { method: 'DELETE', ...options });

export { api };

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; phone: string; password: string }) =>
    api('/auth/register', { method: 'POST', data }),

  login: (data: { email: string; password: string }) =>
    api('/auth/login', { method: 'POST', data }),

  logout: () => api('/auth/logout', { method: 'POST' }),

  getMe: () => api('/auth/me'),

  forgotPassword: (email: string) =>
    api('/auth/forgot-password', { method: 'POST', data: { email } }),

  resetPassword: (token: string, password: string) =>
    api(`/auth/reset-password/${token}`, { method: 'PUT', data: { password } }),

  verifyEmail: (token: string) => api(`/auth/verify-email/${token}`),

  updatePassword: (currentPassword: string, newPassword: string) =>
    api('/auth/update-password', { method: 'PUT', data: { currentPassword, newPassword } }),
};

// User API
export const userAPI = {
  updateProfile: (data: { name?: string; phone?: string; address?: object }) =>
    api('/users/profile', { method: 'PUT', data }),

  updateAvatar: (avatar: string) =>
    api('/users/avatar', { method: 'PUT', data: { avatar } }),

  getDashboard: () => api('/users/dashboard'),
};

// Category API
export const categoryAPI = {
  getAll: () => api('/categories'),
  getBySlug: (slug: string) => api(`/categories/${slug}`),
};

// Event API
export const eventAPI = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return api(`/events${query}`);
  },
  getFeatured: () => api('/events/featured'),
  getBySlug: (slug: string) => api(`/events/${slug}`),
};

// Order API
export const orderAPI = {
  create: (data: object) => api('/orders', { method: 'POST', data }),
  getMyOrders: () => api('/orders/my-orders'),
  getById: (id: string) => api(`/orders/${id}`),
  cancel: (id: string, reason: string) =>
    api(`/orders/${id}/cancel`, { method: 'PUT', data: { reason } }),
  addRating: (id: string, score: number, review: string) =>
    api(`/orders/${id}/rating`, { method: 'PUT', data: { score, review } }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api('/users/admin/dashboard'),
  
  // Users
  getAllUsers: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return api(`/users/admin/all${query}`);
  },
  getUserById: (id: string) => api(`/users/admin/${id}`),
  updateUserRole: (id: string, role: string) =>
    api(`/users/admin/${id}/role`, { method: 'PUT', data: { role } }),
  toggleBlockUser: (id: string) =>
    api(`/users/admin/${id}/block`, { method: 'PUT' }),
  deleteUser: (id: string) => api(`/users/admin/${id}`, { method: 'DELETE' }),

  // Categories
  getAllCategories: () => api('/categories/admin/all'),
  createCategory: (data: object) => api('/categories', { method: 'POST', data }),
  updateCategory: (id: string, data: object) =>
    api(`/categories/${id}`, { method: 'PUT', data }),
  deleteCategory: (id: string) => api(`/categories/${id}`, { method: 'DELETE' }),

  // Events
  getAllEvents: () => api('/events/admin/all'),
  createEvent: (data: object) => api('/events', { method: 'POST', data }),
  updateEvent: (id: string, data: object) =>
    api(`/events/${id}`, { method: 'PUT', data }),
  deleteEvent: (id: string) => api(`/events/${id}`, { method: 'DELETE' }),

  // Orders
  getAllOrders: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return api(`/orders/admin/all${query}`);
  },
  updateOrderStatus: (id: string, status: string, note?: string) =>
    api(`/orders/${id}/status`, { method: 'PUT', data: { status, note } }),
  addOrderNote: (id: string, text: string) =>
    api(`/orders/${id}/notes`, { method: 'POST', data: { text } }),
};
