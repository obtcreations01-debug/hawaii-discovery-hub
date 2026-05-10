/**
 * Hawaii Discovery Hub â frontend API client.
 *
 * Same-origin by default (the Express server serves both frontend and API).
 * To point at a different backend, set window.HDH_API_BASE before this script loads.
 */
(function () {
  const API_BASE = (window.HDH_API_BASE || '') + '/api';

  class ApiClient {
    constructor() {
      this.token = localStorage.getItem('accessToken');
    }

    setToken(token) {
      this.token = token;
      localStorage.setItem('accessToken', token);
    }

    clearTokens() {
      this.token = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }

    getHeaders() {
      const h = { 'Content-Type': 'application/json' };
      if (this.token) h['Authorization'] = `Bearer ${this.token}`;
      return h;
    }

    async refreshToken() {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');
      const response = await fetch(`${API_BASE}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      if (!response.ok) throw new Error('Refresh failed');
      const data = await response.json();
      this.setToken(data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.accessToken;
    }

    async request(endpoint, options = {}) {
      const url = `${API_BASE}${endpoint}`;
      let response = await fetch(url, { ...options, headers: this.getHeaders() });

      if (response.status === 401 && this.token) {
        try {
          const data = await response.clone().json();
          if (data.error && /expired/i.test(data.error)) {
            await this.refreshToken();
            response = await fetch(url, { ...options, headers: this.getHeaders() });
          }
        } catch (_) { /* swallow */ }
      }

      return response;
    }

    // --- Auth ---
    register(payload) {
      return this.request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
    }
    login(email, password) {
      return this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    }

    // --- Listings ---
    getListings(filters = {}) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      return this.request(`/listings?${params}`);
    }
    getListing(id) {
      return this.request(`/listings/${id}`);
    }

    // --- Businesses ---
    getMyBusinesses() {
      return this.request('/businesses');
    }
    createBusiness(payload) {
      return this.request('/businesses', { method: 'POST', body: JSON.stringify(payload) });
    }

    // --- Payments ---
    createCheckout(businessId, tier, period) {
      return this.request('/payments/create-checkout', {
        method: 'POST',
        body: JSON.stringify({ businessId, tier, period })
      });
    }
  }

  window.api = new ApiClient();
})();
