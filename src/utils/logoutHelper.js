import { logoutUser } from './authUtils';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

/**
 * Custom hook that returns a function to handle logout
 * This combines the API call to clear cookies and the Redux action to update state
 * 
 * @returns {Function} handleLogout - Function to call when logging out
 */
export const useLogout = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // First call the API endpoint to clear cookies
      await logoutUser();
      
      // Then dispatch Redux action to update state
      dispatch(logout());
    } catch (error) {
      console.error('Error during logout:', error);
      // Still dispatch logout action even if API call fails
      // to clear local state
      dispatch(logout());
    }
  };

  return handleLogout;
};