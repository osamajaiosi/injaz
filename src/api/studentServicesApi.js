import api from './apiConfig';

/**
 * Student Services API Services
 */
export const studentServicesApi = {
  /**
   * Get all student services
   * @returns {Promise} Promise with student services
   */
  getServices: async () => {
    const response = await api.get('/studentServices');
    return response.data.services;
  },

  /**
   * Get a specific service by ID
   * @param {string} serviceId - ID of the service
   * @returns {Promise} Promise with service details
   */
  getServiceById: async (serviceId) => {
    const response = await api.get('/studentServices');
    const service = response.data.services.find(s => s.id === serviceId);
    return service;
  },

  /**
   * Add a new service subscription
   * @param {Object} serviceData - Service data to add
   * @returns {Promise} Promise with response
   */
  addService: async (serviceData) => {
    const response = await api.post('/studentServices', { service: serviceData });
    return response.data;
  },

  /**
   * Get all requests
   * @returns {Promise} Promise with requests
   */
  getRequests: async () => {
    const response = await api.get('/studentServices');
    return response.data.requests;
  },

  /**
   * Create a new request
   * @param {Object} requestData - Request data
   * @returns {Promise} Promise with response
   */
  createRequest: async (requestData) => {
    const response = await api.post('/studentServices', { request: requestData });
    return response.data;
  }
};