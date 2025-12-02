import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tournamentsApi, type Tournament, authApi } from '@services/api';
import { ROUTES } from '@utils/constants';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectUser, selectIsAuthenticated, setUser } from '@store/slices/authSlice';

export const useGenerateLobbyPageLogic = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showGenerateLobbyModal, setShowGenerateLobbyModal] = useState(false);
  const [tournamentStatus, setTournamentStatus] = useState<'upcoming' | 'live' | 'completed'>('upcoming');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tournamentsLoading, setTournamentsLoading] = useState(false);
  const [tournamentsError, setTournamentsError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    // Load user data if not already in Redux
    const loadUser = async () => {
      if (user) {
        return;
      }

      try {
        const userData = await authApi.getProfile();
        dispatch(setUser(userData));
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    };

    loadUser();
  }, [navigate, isAuthenticated, user, dispatch]);

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Load tournaments function
  const loadTournaments = async () => {
    setTournamentsLoading(true);
    setTournamentsError(null);
    try {
      const params: { status: 'upcoming' | 'live' | 'completed'; fromDate?: string } = {
        status: tournamentStatus,
      };
      
      // Only add fromDate for upcoming tournaments (current day)
      if (tournamentStatus === 'upcoming') {
        params.fromDate = getCurrentDate();
      }
      
      const tournamentsList = await tournamentsApi.getTournaments(params);
      setTournaments(tournamentsList);
    } catch (error: any) {
      // Ignore axios cancel errors (request deduplication)
      if (error?.message?.includes('cancelled') || error?.name === 'CanceledError') {
        return; // Silently ignore cancelled requests
      }
      console.error('Failed to load tournaments:', error);
      setTournamentsError(error?.message || 'Failed to load tournaments');
    } finally {
      setTournamentsLoading(false);
    }
  };

  // Load tournaments based on selected status
  useEffect(() => {
    loadTournaments();
  }, [tournamentStatus]);

  return {
    user,
    sidebarOpen,
    toggleSidebar,
    showGenerateLobbyModal,
    setShowGenerateLobbyModal,
    tournamentStatus,
    setTournamentStatus,
    tournaments,
    tournamentsLoading,
    tournamentsError,
    refreshTournaments: loadTournaments,
  };
};

