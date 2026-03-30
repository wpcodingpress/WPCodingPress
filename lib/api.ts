/**
 * API Helper for Next.js
 * WPCodingPress Frontend
 * 
 * For cPanel deployment (same server):
 * Uses relative URL since Next.js and PHP API are on same domain
 */

const API_BASE_URL = 'https://api.wpcodingpress.com';

// Token storage (use httpOnly cookies in production)
let authToken: string | null = null;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: number;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: {
    [key: string]: T[] | any;
    pagination?: {
      total: number;
      page: number;
      per_page: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

// Set auth token
export function setAuthToken(token: string) {
  authToken = token;
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

// Get auth token
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return authToken;
}

// Clear auth token
export function clearAuthToken() {
  authToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

// Initialize token from storage
export function initAuthToken() {
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('auth_token');
  }
}

// Generic API request
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data as ApiResponse<T>;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// GET request
export async function get<T = any>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<ApiResponse<T>> {
  let url = endpoint;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  return apiRequest<T>(url, { method: 'GET' });
}

// POST request
export async function post<T = any>(
  endpoint: string,
  body?: Record<string, any>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

// PUT request
export async function put<T = any>(
  endpoint: string,
  body?: Record<string, any>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST', // PHP APIs use POST for updates
    body: body ? JSON.stringify(body) : undefined,
  });
}

// DELETE request
export async function del<T = any>(
  endpoint: string,
  body?: Record<string, any>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST', // PHP APIs use POST for deletes
    body: body ? JSON.stringify(body) : undefined,
  });
}

// ============ AUTH API ============

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'client' | 'editor' | 'viewer';
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: User;
  expires_in: number;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // NextAuth login - uses session-based auth
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    // Get session
    const sessionRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/auth/session`);
    const session = await sessionRes.json();
    
    return {
      token: 'session',
      refresh_token: 'session',
      user: session?.user || { id: 0, name: credentials.email, email: credentials.email, role: 'client' as const },
      expires_in: 2592000
    };
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Registration failed');
    }

    return {
      token: 'registered',
      refresh_token: 'registered',
      user: { id: 0, name: data.name, email: data.email, role: 'client' as const },
      expires_in: 2592000
    };
  },

  async logout(): Promise<void> {
    try {
      await post('/routes/auth/logout.php');
    } finally {
      clearAuthToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('refresh_token');
      }
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await get<User>('/routes/auth/me.php');
    return response.data;
  },

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refresh_token') 
      : null;
    
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await post<AuthResponse>('/routes/auth/refresh.php', {
      refresh_token: refreshToken,
    });

    if (response.success) {
      setAuthToken(response.data.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
    }

    return response.data;
  },

  isAuthenticated(): boolean {
    return !!getAuthToken();
  },
};

// ============ SERVICES API ============

export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  basic_price: number;
  standard_price: number;
  premium_price: number;
  basic_features: string[];
  standard_features: string[];
  premium_features: string[];
  sort_order: number;
  is_active: boolean;
}

export const servicesApi = {
  async getAll(params?: { page?: number; per_page?: number; active?: boolean }): Promise<{
    services: Service[];
    pagination: any;
  }> {
    const queryParams = params ? {
      ...params,
      active: params.active?.toString()
    } : undefined;
    const response = await get<{ services: Service[]; pagination: any }>('/routes/services/get.php', queryParams as Record<string, string | number>);
    return response.data;
  },

  async create(data: Partial<Service>): Promise<Service> {
    const response = await post<Service>('/routes/services/create.php', data);
    return response.data;
  },

  async update(id: number, data: Partial<Service>): Promise<Service> {
    const response = await post<Service>('/routes/services/update.php', { id, ...data });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await del('/routes/services/delete.php', { id });
  },
};

// ============ ORDERS API ============

export interface Order {
  id: number;
  service_id: number;
  service_name?: string;
  service_slug?: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  package_type: 'basic' | 'standard' | 'premium';
  message: string;
  budget?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export const ordersApi = {
  async getAll(params?: { page?: number; per_page?: number; status?: string }): Promise<{
    orders: Order[];
    pagination: any;
  }> {
    const response = await get<{ orders: Order[]; pagination: any }>('/routes/orders/get.php', params);
    return response.data;
  },

  async create(data: {
    service_id: number;
    client_name: string;
    client_email: string;
    client_phone: string;
    package_type: string;
    message?: string;
    budget?: string;
  }): Promise<Order> {
    const response = await post<Order>('/routes/orders/create.php', data);
    return response.data;
  },

  async updateStatus(id: number, status: string, admin_notes?: string): Promise<Order> {
    const response = await post<Order>('/routes/orders/update.php', { id, status, admin_notes });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await del('/routes/orders/delete.php', { id });
  },
};

// ============ CONTACTS API ============

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read: boolean;
  is_replied: boolean;
  created_at: string;
}

export const contactsApi = {
  async getAll(params?: { page?: number; per_page?: number; unread?: boolean }): Promise<{
    contacts: Contact[];
    pagination: any;
  }> {
    const queryParams = params ? {
      ...params,
      unread: params.unread?.toString()
    } : undefined;
    const response = await get<{ contacts: Contact[]; pagination: any }>('/routes/contacts/get.php', queryParams as Record<string, string | number>);
    return response.data;
  },

  async create(data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }): Promise<Contact> {
    const response = await post<Contact>('/routes/contacts/create.php', data);
    return response.data;
  },

  async markAsRead(id: number): Promise<Contact> {
    const response = await post<Contact>('/routes/contacts/read.php', { id });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await del('/routes/contacts/delete.php', { id });
  },
};

// ============ PORTFOLIO API ============

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image_url: string;
  thumbnail_url?: string;
  description?: string;
  client?: string;
  url?: string;
  technologies: string[];
  sort_order: number;
  is_active: boolean;
}

export const portfolioApi = {
  async getAll(params?: {
    page?: number;
    per_page?: number;
    category?: string;
    active?: boolean;
  }): Promise<{
    portfolio: PortfolioItem[];
    categories: string[];
    pagination: any;
  }> {
    const queryParams = params ? {
      ...params,
      active: params.active?.toString()
    } : undefined;
    const response = await get<{
      portfolio: PortfolioItem[];
      categories: string[];
      pagination: any;
    }>('/routes/portfolio/get.php', queryParams as Record<string, string | number>);
    return response.data;
  },

  async create(data: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const response = await post<PortfolioItem>('/routes/portfolio/create.php', data);
    return response.data;
  },

  async update(id: number, data: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const response = await post<PortfolioItem>('/routes/portfolio/update.php', { id, ...data });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await del('/routes/portfolio/delete.php', { id });
  },
};

export default {
  get,
  post,
  put,
  del,
  auth: authApi,
  services: servicesApi,
  orders: ordersApi,
  contacts: contactsApi,
  portfolio: portfolioApi,
  setAuthToken,
  getAuthToken,
  clearAuthToken,
  initAuthToken,
};
