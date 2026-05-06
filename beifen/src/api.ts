import type { Article, ArticleFormData } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface LoginResponse {
  token: string;
  user: {
    username: string;
    role: string;
  };
}

export const api = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '登录失败');
    }
    return response.json();
  },

  verifyToken: async (token: string): Promise<{ valid: boolean; user?: any }> => {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      return { valid: false };
    }
    return response.json();
  },

  getArticles: async (): Promise<Article[]> => {
    const response = await fetch(`${API_BASE}/articles`);
    if (!response.ok) throw new Error('获取文章列表失败');
    return response.json();
  },

  getAdminArticles: async (token: string): Promise<Article[]> => {
    const response = await fetch(`${API_BASE}/admin/articles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('获取文章列表失败');
    return response.json();
  },

  getArticle: async (id: string): Promise<Article> => {
    const response = await fetch(`${API_BASE}/articles/${id}`);
    if (!response.ok) throw new Error('获取文章失败');
    return response.json();
  },

  searchArticles: async (keyword: string): Promise<Article[]> => {
    const response = await fetch(`${API_BASE}/articles/search?keyword=${encodeURIComponent(keyword)}`);
    if (!response.ok) throw new Error('搜索失败');
    return response.json();
  },

  createArticle: async (data: ArticleFormData, token: string): Promise<Article> => {
    const response = await fetch(`${API_BASE}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '创建失败');
    }
    return response.json();
  },

  updateArticle: async (id: string, data: ArticleFormData, token: string): Promise<Article> => {
    const response = await fetch(`${API_BASE}/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '更新失败');
    }
    return response.json();
  },

  deleteArticle: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/articles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error('删除失败');
    }
  },

  uploadImage: async (file: File, token: string): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '上传失败');
    }
    return response.json();
  },
};

export const authAPI = {
  ...api,
  verify: api.verifyToken,
};
