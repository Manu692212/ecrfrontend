const DEFAULT_API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:8000/api' 
  : 'https://ecrbackend.onrender.com/api';

const resolveApiBaseUrl = () => {
  const raw = import.meta.env.VITE_API_URL?.trim();

  if (!raw) {
    return DEFAULT_API_BASE_URL;
  }

  const sanitized = raw.replace(/\/+$/, '');

  const supplyFallback = () => DEFAULT_API_BASE_URL;

  try {
    const isBrowser = typeof window !== 'undefined';
    const parsed = isBrowser
      ? new URL(sanitized, window.location.origin)
      : new URL(sanitized);
    const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname);
    const isAbsoluteUrl = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(sanitized);
    const isSameOrigin = isBrowser && parsed.origin === window.location.origin;

    if (!import.meta.env.DEV) {
      if (isLocalhost) {
        return DEFAULT_API_BASE_URL;
      }

      if (isSameOrigin && (!isAbsoluteUrl || sanitized.startsWith('/'))) {
        return DEFAULT_API_BASE_URL;
      }
    }

    if (!parsed.pathname || parsed.pathname === '/' || parsed.pathname === '') {
      parsed.pathname = '/api';
    }

    return `${parsed.origin}${parsed.pathname.replace(/\/$/, '')}`;
  } catch {
    return sanitized || supplyFallback();
  }
};

const API_BASE_URL = resolveApiBaseUrl();

type RequestOptions = {
  headers?: Record<string, string>;
  responseType?: 'json' | 'blob' | 'text';
  skipErrorStatuses?: number[];
};

type ExtendedRequestOptions = RequestOptions & {
  body?: any;
};

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

const redirectToLogin = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  window.location.href = '/login';
};

const isFormData = (payload: any): payload is FormData => payload instanceof FormData;

const buildPayload = (payload: any) => {
  if (payload === undefined || payload === null) return payload;
  if (payload instanceof Blob || isFormData(payload)) return payload;
  if (typeof payload === 'object') return JSON.stringify(payload);
  return payload;
};

const request = async (method: string, url: string, options: ExtendedRequestOptions = {}) => {
  const {
    body,
    headers = {},
    responseType = 'json',
    skipErrorStatuses = [],
  } = options;
  const token = getAuthToken();

  const mergedHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  const findHeaderKey = (name: string) =>
    Object.keys(mergedHeaders).find((key) => key.toLowerCase() === name.toLowerCase());

  const hasAuthorization = Boolean(findHeaderKey('Authorization'));
  if (token && !hasAuthorization) {
    mergedHeaders.Authorization = `Bearer ${token}`;
  }

  const isPayloadFormData = isFormData(body);
  const contentTypeKey = findHeaderKey('Content-Type');
  if (isPayloadFormData && contentTypeKey) {
    delete mergedHeaders[contentTypeKey];
  }

  const shouldSetJsonHeader =
    body !== undefined &&
    body !== null &&
    !isPayloadFormData &&
    typeof body === 'object' &&
    !contentTypeKey;

  if (shouldSetJsonHeader) {
    mergedHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: mergedHeaders,
    body: buildPayload(body),
    credentials: 'include',
  });

  if (response.status === 401) {
    redirectToLogin();
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    if (skipErrorStatuses.includes(response.status)) {
      if (responseType === 'blob') {
        return null;
      }

      if (responseType === 'text') {
        return '';
      }

      return null;
    }

    const errorText = await response.text();
    let errorMessage = response.statusText;
    if (errorText) {
      try {
        const errorPayload = JSON.parse(errorText);
        if (errorPayload?.message) {
          errorMessage = errorPayload.message;
        } else if (typeof errorPayload === 'string') {
          errorMessage = errorPayload;
        }
      } catch {
        errorMessage = errorText;
      }
    }
    throw new Error(errorMessage);
  }

  if (responseType === 'blob') {
    return response.blob();
  }

  if (responseType === 'text') {
    return response.text();
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
};

const api = {
  get: (url: string, config?: RequestOptions) => request('GET', url, config),
  post: (url: string, data?: any, config?: RequestOptions) => request('POST', url, { ...config, body: data }),
  put: (url: string, data?: any, config?: RequestOptions) => request('PUT', url, { ...config, body: data }),
  delete: (url: string, config?: RequestOptions) => request('DELETE', url, config),
  patch: (url: string, data?: any, config?: RequestOptions) =>
    request('PATCH', url, { ...config, body: data }),
};

export const authAPI = {
  login: async (email: string, password: string) => {
    return api.post('/admins/login', { email, password });
  },
};

export const adminsAPI = {
  getAll: async (page = 1) => {
    const response = await api.get(`/admins?page=${page}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/admins/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/admins', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/admins/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/admins/${id}`);
    return response.data;
  },
};

export const studentsAPI = {
  getAll: async (page = 1) => {
    const response = await api.get(`/students?page=${page}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/students', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
  uploadResume: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post(`/students/${id}/upload-resume`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  downloadResume: async (id: string) => {
    const response = await api.get(`/students/${id}/download-resume`, {
      responseType: 'blob',
    });
    return response.data;
  },
  deleteResume: async (id: string) => {
    const response = await api.delete(`/students/${id}/resume`);
    return response.data;
  },
};

export const coursesAPI = {
  getAll: async (page = 1) => {
    const response = await api.get(`/courses?page=${page}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/courses', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
};

export const enrollmentsAPI = {
  getAll: async (page = 1) => {
    const response = await api.get(`/enrollments?page=${page}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/enrollments/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/enrollments', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/enrollments/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/enrollments/${id}`);
    return response.data;
  },
  getByStudent: async (studentId: string, page = 1) => {
    const response = await api.get(`/enrollments/student/${studentId}?page=${page}`);
    return response.data;
  },
  getByCourse: async (courseId: string, page = 1) => {
    const response = await api.get(`/enrollments/course/${courseId}?page=${page}`);
    return response.data;
  },
};

export const reportsAPI = {
  dashboard: async () => {
    const response = await api.get('/reports/dashboard');
    return response.data;
  },
  enrollmentStats: async () => {
    const response = await api.get('/reports/enrollments');
    return response.data;
  },
  courseStats: async () => {
    const response = await api.get('/reports/courses');
    return response.data;
  },
  studentStats: async () => {
    const response = await api.get('/reports/students');
    return response.data;
  },
  revenueStats: async () => {
    const response = await api.get('/reports/revenue');
    return response.data;
  },
  exportData: async (type: string) => {
    const response = await api.get(`/reports/export?type=${type}`);
    return response.data;
  },
};

export const notificationsAPI = {
  getAll: async (page = 1) => {
    const response = await api.get(`/notifications?page=${page}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/notifications', data);
    return response.data;
  },
  markAsRead: async (id: string) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },
};

export const academicCouncilAPI = {
  getAll: async (page = 1) => {
    return api.get(`/academic-council?page=${page}`);
  },
  getById: async (id: string | number) => {
    return api.get(`/academic-council/${id}`);
  },
  create: async (data: FormData) => {
    const response = await api.post('/academic-council', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },
  update: async (id: string | number, data: any) => {
    return api.put(`/academic-council/${id}`, data);
  },
  delete: async (id: string | number) => {
    return api.delete(`/academic-council/${id}`);
  },
  uploadImage: async (
    id: string | number,
    file: File,
    options?: { image_size?: 'small' | 'medium' | 'large'; image_width?: number; image_height?: number }
  ) => {
    const formData = new FormData();
    formData.append('image', file);
    if (options?.image_size) formData.append('image_size', options.image_size);
    if (options?.image_width) formData.append('image_width', String(options.image_width));
    if (options?.image_height) formData.append('image_height', String(options.image_height));

    return api.post(`/academic-council/${id}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getPublicList: async () => {
    return api.get('/public/academic-council');
  },
};

export const managementAPI = {
  getAll: async (page = 1) => {
    return api.get(`/management?page=${page}`);
  },
  getById: async (id: string | number) => {
    return api.get(`/management/${id}`);
  },
  create: async (data: FormData) => {
    const response = await api.post('/management', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },
  update: async (id: string | number, data: any) => {
    return api.put(`/management/${id}`, data);
  },
  delete: async (id: string | number) => {
    return api.delete(`/management/${id}`);
  },
  uploadImage: async (
    id: string | number,
    file: File,
    options?: { image_size?: 'small' | 'medium' | 'large'; image_width?: number; image_height?: number }
  ) => {
    const formData = new FormData();
    formData.append('image', file);
    if (options?.image_size) formData.append('image_size', options.image_size);
    if (options?.image_width) formData.append('image_width', String(options.image_width));
    if (options?.image_height) formData.append('image_height', String(options.image_height));

    return api.post(`/management/${id}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getPublicList: async () => {
    return api.get('/public/management');
  },
};

export const facilitiesAPI = {
  getAll: async (page = 1) => {
    return api.get(`/facilities?page=${page}`);
  },
  getById: async (id: string | number) => {
    return api.get(`/facilities/${id}`);
  },
  create: async (data: FormData) => {
    return api.post('/facilities', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: async (id: string | number, data: any) => {
    return api.put(`/facilities/${id}`, data);
  },
  delete: async (id: string | number) => {
    return api.delete(`/facilities/${id}`);
  },
  uploadImage: async (
    id: string | number,
    file: File,
    options?: { image_size?: 'small' | 'medium' | 'large'; image_width?: number; image_height?: number }
  ) => {
    const formData = new FormData();
    formData.append('image', file);
    if (options?.image_size) formData.append('image_size', options.image_size);
    if (options?.image_width) formData.append('image_width', String(options.image_width));
    if (options?.image_height) formData.append('image_height', String(options.image_height));

    return api.post(`/facilities/${id}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getPublicList: async () => {
    return api.get('/public/facilities');
  },
};

export const settingsAPI = {
  getGroupPublic: async (group: string) => {
    const response = await api.get(`/public/settings/group/${group}`, {
      skipErrorStatuses: [404],
    });

    if (!response) {
      return [];
    }

    return response.data ?? response;
  },
  getByKey: async (key: string) => {
    const response = await api.get(`/settings/key/${key}`, {
      skipErrorStatuses: [404],
    });

    if (!response) {
      return null;
    }

    return response.data ?? response;
  },
  getGroup: async (group: string) => {
    const response = await api.get(`/settings/group/${group}`);
    return response.data;
  },
  getAll: async (page = 1) => {
    const response = await api.get(`/settings?page=${page}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/settings', data);
    return response.data;
  },
  update: async (id: string | number, data: any) => {
    const response = await api.put(`/settings/${id}`, data);
    return response.data;
  },
};

export default api;
