import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (name: string, email: string, password: string, phone?: string, userType?: string) =>
    api.post('/auth/register', { name, email, password, phone, userType }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const userProfileService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (formData: FormData) =>
    api.put('/user/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/user/change-password', { currentPassword, newPassword }),
};

export const landService = {
  getAllLands: (params?: any) => api.get('/lands', { params }),
  getLandById: (id: string) => api.get(`/lands/${id}`),
  createLand: (formData: FormData) =>
    api.post('/lands', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateLand: (id: string, formData: FormData) =>
    api.put(`/lands/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteLand: (id: string) => api.delete(`/lands/${id}`),
  getMyLands: () => api.get('/lands/my-lands'),
};

export const savedLandService = {
  saveLand: (landId: string) => api.post('/saved-lands', { landId }),
  getSavedLands: () => api.get('/saved-lands'),
  unsaveLand: (landId: string) => api.delete(`/saved-lands/${landId}`),
};

export const savedLandNoteService = {
  addNote: (landId: string, note: string, category?: string) =>
    api.post('/saved-land-notes', { landId, note, category }),
  getNotesByLand: (landId: string) => api.get(`/saved-land-notes/land/${landId}`),
  updateNote: (id: string, note: string, category?: string) =>
    api.put(`/saved-land-notes/${id}`, { note, category }),
  deleteNote: (id: string) => api.delete(`/saved-land-notes/${id}`),
};

export const buyerLeadService = {
  createLead: (landId: string, message: string) =>
    api.post('/buyer-leads', { landId, message }),
  getMyLeads: () => api.get('/buyer-leads/my-leads'),
  getLeadsForMyLands: () => api.get('/buyer-leads/received'),
  updateLeadStatus: (id: string, status: string) =>
    api.put(`/buyer-leads/${id}/status`, { status }),
  deleteLead: (id: string) => api.delete(`/buyer-leads/${id}`),
};

export const comparisonService = {
  createComparison: (landIds: string[], name?: string) =>
    api.post('/comparisons', { landIds, name }),
  getMyComparisons: () => api.get('/comparisons'),
  getComparisonById: (id: string) => api.get(`/comparisons/${id}`),
  deleteComparison: (id: string) => api.delete(`/comparisons/${id}`),
};

export const priceOfferService = {
  createOffer: (landId: string, offerPrice: number, message?: string) =>
    api.post('/price-offers', { landId, offerPrice, message }),
  getMyOffers: () => api.get('/price-offers/my-offers'),
  getReceivedOffers: () => api.get('/price-offers/received'),
  respondToOffer: (id: string, status: string, counterPrice?: number, counterMessage?: string) =>
    api.put(`/price-offers/${id}/respond`, { status, counterPrice, counterMessage }),
  deleteOffer: (id: string) => api.delete(`/price-offers/${id}`),
};

export const reviewService = {
  createReview: (landId: string, rating: number, comment: string) =>
    api.post('/reviews', { landId, rating, comment }),
  getReviewsByLand: (landId: string) => api.get(`/reviews/land/${landId}`),
  updateReview: (id: string, rating: number, comment: string) =>
    api.put(`/reviews/${id}`, { rating, comment }),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
};

export const analyticsService = {
  getAdminAnalytics: () => api.get('/analytics/admin'),
  getSellerAnalytics: () => api.get('/analytics/seller'),
};

export default api;
