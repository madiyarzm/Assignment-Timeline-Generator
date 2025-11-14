// API клиент для работы с бэкендом
const API_BASE_URL = "http://127.0.0.1:5000";

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      credentials: "include", // Для поддержки cookies/sessions Flask-Login
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle empty responses
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name, email, password) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  // Assignment endpoints
  async getAssignments() {
    return this.request("/assignments");
  }

  async getAssignment(id) {
    return this.request(`/assignments/${id}`);
  }

  async createAssignment(assignment) {
    return this.request("/assignments", {
      method: "POST",
      body: JSON.stringify(assignment),
    });
  }

  async updateAssignment(id, assignment) {
    return this.request(`/assignments/${id}`, {
      method: "PUT",
      body: JSON.stringify(assignment),
    });
  }

  async deleteAssignment(id) {
    return this.request(`/assignments/${id}`, {
      method: "DELETE",
    });
  }
}

export default new ApiClient();
