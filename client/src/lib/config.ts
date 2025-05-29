// API configuration for different environments
export const API_CONFIG = {
  // In development, use Express routes
  // In production (Netlify), use Netlify functions
  baseURL: import.meta.env.PROD ? '/.netlify/functions' : '/api',
  
  endpoints: {
    calculate: import.meta.env.PROD ? '/.netlify/functions/calculate' : '/api/calculate',
    averageEmissions: import.meta.env.PROD ? '/.netlify/functions/average-emissions' : '/api/average-emissions',
    registerStudent: import.meta.env.PROD ? '/.netlify/functions/register-student' : '/api/register-student',
  }
};