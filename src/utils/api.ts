import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Sends cookies (refresh token)
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Sending Authorization:", config.headers.Authorization); // Debugging
  } else {
    console.warn("❌ No token found!");
  }

  return config;
},
  (error) => Promise.reject(error)
);

// Refresh token interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const refreshResponse = await axios.post(
        'http://localhost:4000/auth/refresh-token',
        // { refreshToken: document.cookie.split('; ').find(row => row.startsWith('refreshToken=')).split('=')[1] },
        {},
        { withCredentials: true }
      );

      localStorage.setItem('token', refreshResponse.data.accessToken);
      error.config.headers['Authorization'] = `Bearer ${refreshResponse.data.accessToken}`;
      return axios(error.config);
    }

    return Promise.reject(error);
  }
);

export default api;
