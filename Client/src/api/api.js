/**
 * Base API configuration file
 * This centralizes all API endpoint URLs
 */

const API_BASE_URL = 'https://mern-project-5vz5.onrender.com';

// Auth endpoints
export const API_ENDPOINTS = {
  // Auth
  SIGNUP: `${API_BASE_URL}/signup`,
  LOGIN: `${API_BASE_URL}/login`,
  INTERESTS: `${API_BASE_URL}/interests`,
  
  // Stories
  STORIES: `${API_BASE_URL}/stories`,
  USER_STORIES: `${API_BASE_URL}/stories/user`,
  STORY_BY_ID: (id) => `${API_BASE_URL}/clicked/stories/${id}`,
  LIKE_STORY: (id) => `${API_BASE_URL}/stories/${id}/like`,
  UNLIKE_STORY: (id) => `${API_BASE_URL}/stories/${id}/like`,
  USER_LIKED_STORIES: (userId) => `${API_BASE_URL}/stories/${userId}`,
  
  // Profile
  PROFILE: `${API_BASE_URL}/profiles`,
  
  // Feed
  FEED: `${API_BASE_URL}/feeds`,
  
  // Search
  SEARCH: (query) => `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`
};

/**
 * Helper function to make authenticated API requests
 * @param {string} url - The API endpoint
 * @param {Object} options - Request options
 * @returns {Promise} - Fetch promise
 */
export const authenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return fetch(url, {
    ...options,
    headers
  });
};

export default API_ENDPOINTS;