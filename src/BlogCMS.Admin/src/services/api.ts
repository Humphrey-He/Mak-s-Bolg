import axios, { AxiosError } from 'axios';
import type {
  Article,
  ArticleListItem,
  ArticleStatus,
  CreateArticleRequest,
  UpdateArticleRequest,
  LoginResponse,
  PublishJob,
  User,
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  MediaItem,
  MediaListResponse,
} from '../types';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { username, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// Articles API
export const articlesApi = {
  getAll: async (status?: ArticleStatus, tag?: string): Promise<ArticleListItem[]> => {
    const params: Record<string, string> = {};
    if (status !== undefined) params.status = status.toString();
    if (tag) params.tag = tag;
    const response = await api.get<ArticleListItem[]>('/articles', { params });
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Article> => {
    const response = await api.get<Article>(`/articles/${slug}`);
    return response.data;
  },

  create: async (data: CreateArticleRequest): Promise<Article> => {
    const response = await api.post<Article>('/articles', data);
    return response.data;
  },

  update: async (id: number, data: UpdateArticleRequest): Promise<Article> => {
    const response = await api.put<Article>(`/articles/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/articles/${id}`);
  },

  publish: async (id: number): Promise<PublishJob> => {
    const response = await api.post<PublishJob>(`/articles/${id}/publish`);
    return response.data;
  },
};

// Jobs API
export const jobsApi = {
  get: async (id: number): Promise<PublishJob> => {
    const response = await api.get<PublishJob>(`/jobs/${id}`);
    return response.data;
  },
};

// Tags API
export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    const response = await api.get<Tag[]>('/tags');
    return response.data;
  },

  getById: async (id: number): Promise<Tag> => {
    const response = await api.get<Tag>(`/tags/${id}`);
    return response.data;
  },

  create: async (data: CreateTagRequest): Promise<Tag> => {
    const response = await api.post<Tag>('/tags', data);
    return response.data;
  },

  update: async (id: number, data: UpdateTagRequest): Promise<Tag> => {
    const response = await api.put<Tag>(`/tags/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },

  updateCounts: async (): Promise<void> => {
    await api.put('/tags/update-counts');
  },
};

// Media API
export const mediaApi = {
  getAll: async (page = 1, pageSize = 20): Promise<MediaListResponse> => {
    const response = await api.get<MediaListResponse>('/media', { params: { page, pageSize } });
    return response.data;
  },

  upload: async (file: File): Promise<MediaItem> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<MediaItem>('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/media/${id}`);
  },

  getByUrl: async (url: string): Promise<MediaItem> => {
    const response = await api.get<MediaItem>('/media/by-url', { params: { url } });
    return response.data;
  },
};

// Helper to check if user is logged in
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Helper to get stored user
export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Helper to store auth data
export const storeAuthData = (response: LoginResponse): void => {
  localStorage.setItem('token', response.token);
  localStorage.setItem('user', JSON.stringify(response.user));
};

// Helper to clear auth data
export const clearAuthData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
