import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("lockedin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth
export const authAPI = {
  register: (data: { name: string; email: string; password: string; headline?: string; location?: string; linkedin_url?: string; github_url?: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

// Profile
export const profileAPI = {
  getPublic: (lockedinId: string) => api.get(`/profile/${lockedinId}`),
  update: (data: Record<string, string>) => api.put("/profile/update", data),
  addExperience: (data: Record<string, string>) => api.post("/profile/experience", data),
  addEducation: (data: Record<string, string>) => api.post("/profile/education", data),
  addSkills: (data: { name: string }[]) => api.post("/profile/skills", data),
  updateLinks: (data: Record<string, string>) => api.post("/profile/links", data),
};

// Claims
export const claimsAPI = {
  create: (data: { type: string; title: string; description?: string; credential_id?: string; external_url?: string }) =>
    api.post("/claims/create", data),
  getMy: () => api.get("/claims/my"),
  getUser: (userId: string) => api.get(`/claims/user/${userId}`),
  get: (claimId: string) => api.get(`/claims/${claimId}`),
  addEvidence: (claimId: string, data: { type: string; file_url?: string; external_url?: string }) =>
    api.post(`/claims/${claimId}/evidence`, data),
};

// Trust
export const trustAPI = {
  getScore: (userId: string) => api.get(`/trust/${userId}`),
};

// Search
export const searchAPI = {
  professionals: (params: { q?: string; verified_only?: boolean; min_score?: number; skills?: string; page?: number }) =>
    api.get("/search/professionals", { params }),
};

// Connections
export const connectionsAPI = {
  request: (userId: string) => api.post(`/connections/request/${userId}`),
  accept: (connectionId: string) => api.patch(`/connections/${connectionId}/accept`),
  getMy: () => api.get("/connections/my"),
};

// Notifications
export const notificationsAPI = {
  getAll: () => api.get("/notifications/"),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
};

export default api;
