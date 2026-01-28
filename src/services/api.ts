import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_session");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth endpoints
export const authAPI = {
  signIn: (email: string, password: string) =>
    api.post("/auth/signin", { email, password }),

  signUp: (
    email: string,
    password: string,
    fullName: string,
    userType: string,
  ) => api.post("/auth/signup", { email, password, fullName, userType }),

  signOut: () => api.post("/auth/signout"),

  getProfile: () => api.get("/auth/profile"),

  verify: () => api.get("/auth/verify"),
};

// Restaurant endpoints
export const restaurantAPI = {
  getProfile: (userId: string) => api.get(`/restaurants/user/${userId}`),

  getListings: (restaurantId: string) =>
    api.get(`/restaurants/${restaurantId}/listings`),

  createListing: (restaurantId: string, data: Record<string, unknown>) =>
    api.post(`/restaurants/${restaurantId}/listings`, data),
};

// Orphanage endpoints
export const orphanageAPI = {
  getProfile: (userId: string) => api.get(`/orphanages/user/${userId}`),

  getAvailableListings: () => api.get("/orphanages/listings/available"),

  claimListing: (listingId: string, notes?: string) =>
    api.post("/orphanages/claims", { listingId, notes }),
};

// Admin endpoints
export const adminAPI = {
  getStats: () => api.get("/admin/stats"),

  getPendingApprovals: () => api.get("/admin/pending-approvals"),

  approveEntity: (id: string, type: "restaurant" | "orphanage") =>
    api.patch(`/admin/${type}s/${id}/approve`),

  rejectEntity: (id: string, type: "restaurant" | "orphanage") =>
    api.patch(`/admin/${type}s/${id}/reject`),
};
