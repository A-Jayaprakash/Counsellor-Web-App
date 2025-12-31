import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { rehydrateAuth } from '../redux/slices/authSlice';

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Rehydrate auth state from localStorage on app load
    dispatch(rehydrateAuth());
  }, [dispatch]);

  return children;
};

export default AppInitializer;
