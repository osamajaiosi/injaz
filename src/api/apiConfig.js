import axios from 'axios';

// Create base axios instance - for real API endpoints
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// For local development with JSON files
const localApi = {
  get: async (url) => {
    try {
      // In development, we directly import the JSON files
      // This simulates an API call but uses local data
      const response = await import(`./data${url}.json`);
      return { data: response.default || response };
    } catch (error) {
      console.error('Error fetching local data:', error);
      throw error;
    }
  },
  
  // Add more methods as needed for POST, PUT, etc.
  post: async (url, data) => {
    // This is just a mock implementation
    console.log(`Mock POST to ${url} with data:`, data);
    return { data: { success: true, message: 'Data saved (mock)' } };
  },
  
  put: async (url, data) => {
    // This is just a mock implementation
    console.log(`Mock PUT to ${url} with data:`, data);
    return { data: { success: true, message: 'Data updated (mock)' } };
  }
};

// Export the appropriate API based on environment
const isDevelopment = import.meta.env.DEV || true;
export default isDevelopment ? localApi : api;