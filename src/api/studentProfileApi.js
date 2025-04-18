import api from './apiConfig';

/**
 * Student Profile API Services
 */
export const studentProfileApi = {
  /**
   * Get student profile data
   * @returns {Promise} Promise with student profile data
   */
  getProfileData: async () => {
    const response = await api.get('/studentData');
    return response.data;
  },

  /**
   * Update student profile data
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Promise with response
   */
  updateProfileData: async (profileData) => {
    const response = await api.put('/studentData', { profile: profileData });
    return response.data;
  },

  /**
   * Get student statistics
   * @returns {Promise} Promise with student stats
   */
  getStats: async () => {
    const response = await api.get('/studentData');
    return response.data.stats;
  },

  /**
   * Get course data
   * @returns {Promise} Promise with course data
   */
  getCourseData: async () => {
    const response = await api.get('/studentData');
    return response.data.courses;
  },

  /**
   * Get upcoming tasks
   * @returns {Promise} Promise with upcoming tasks
   */
  getUpcomingTasks: async () => {
    const response = await api.get('/studentData');
    return response.data.upcomingTasks;
  }
};