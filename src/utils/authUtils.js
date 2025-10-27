/**
 * Utility functions for authentication and token handling
 */

/**
 * Parse and decode a JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    // JWT structure: header.payload.signature
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
};

/**
 * Check if a token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired or invalid
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const expirationTime = decoded.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  
  return currentTime > expirationTime;
};

/**
 * Get token information for debugging
 * @param {string} token - JWT token
 * @returns {Object} Token information
 */
export const getTokenInfo = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return { valid: false, message: 'Invalid token' };
  
  const isExpired = isTokenExpired(token);
  const expiryDate = decoded.exp ? new Date(decoded.exp * 1000).toLocaleString() : 'Unknown';
  
  return {
    valid: true,
    expired: isExpired,
    userId: decoded.sub || decoded._id,
    expiresAt: expiryDate,
    tokenType: decoded.type || 'Unknown',
    payload: decoded
  };
};

/**
 * Debug function to check token validity
 */
export const debugAuthToken = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  console.group('Auth Token Debug');
  
  if (!accessToken) {
    console.warn('No access token found in localStorage');
  } else {
    const tokenInfo = getTokenInfo(accessToken);
   // console.log('Access Token Info:', tokenInfo);
  }
  
  if (!refreshToken) {
    console.warn('No refresh token found in localStorage');
  } else {
    const refreshTokenInfo = getTokenInfo(refreshToken);
    //console.log('Refresh Token Info:', refreshTokenInfo);
  }
  
  console.groupEnd();
};

/**
 * Logout the user by clearing cookies and local storage
 * @returns {Promise} Promise that resolves when logout is complete
 */
export const logoutUser = async () => {
  try {
    // Import here to avoid circular dependencies
    const { axiosAuth } = await import('./axiosConfig');
    
    // Call logout endpoint which clears cookies
    await axiosAuth.post('/users/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Also clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export default {
  decodeToken,
  isTokenExpired,
  getTokenInfo,
  debugAuthToken,
  logoutUser
};