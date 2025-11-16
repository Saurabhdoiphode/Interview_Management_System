import apiClient from './api';

export const jobService = {
  async getAllJobs(params) {
    const response = await apiClient.get('/jobs', { params });
    return response.data;
  },

  async getJobById(id) {
    const response = await apiClient.get(`/jobs/${id}`);
    return response.data;
  },

  async createJob(data) {
    const response = await apiClient.post('/jobs', data);
    return response.data;
  },

  async updateJob(id, data) {
    const response = await apiClient.put(`/jobs/${id}`, data);
    return response.data;
  },

  async deleteJob(id) {
    const response = await apiClient.delete(`/jobs/${id}`);
    return response.data;
  },

  async searchJobs(query) {
    const response = await apiClient.get('/jobs/search', { params: { q: query } });
    return response.data;
  },
};
