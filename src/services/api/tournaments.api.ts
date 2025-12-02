import apiClient from './client';

export interface Tournament {
  _id: string;
  id?: string; // For backward compatibility
  game: string;
  mode: string;
  subMode: string;
  entryFee: number;
  maxPlayers: number;
  availableSlots?: number;
  joinedCount?: number;
  date: string; // ISO format or YYYY-MM-DD
  startTime: string;
  lockTime: string;
  participants: unknown[];
  hostId: string | null;
  room: {
    roomId: string | null;
    password: string | null;
  };
  prizePool: number;
  status: 'upcoming' | 'live' | 'completed';
  results: Array<{
    userId: string;
  }>;
  region?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TournamentsListResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    status?: string;
    total?: number;
    tournaments: Tournament[];
  };
}

export interface GetTournamentsParams {
  status?: 'upcoming' | 'live' | 'completed';
  fromDate?: string; // YYYY-MM-DD format, for upcoming only
}

export const tournamentsApi = {
  /**
   * Get tournaments list (Admin only)
   * @param params - Query parameters for filtering tournaments
   */
  getTournaments: async (params?: GetTournamentsParams): Promise<Tournament[]> => {
    const queryParams: Record<string, string> = {};
    
    if (params?.status) {
      queryParams.status = params.status;
    }
    
    if (params?.fromDate) {
      queryParams.fromDate = params.fromDate;
    }
    
    const response = await apiClient.get<TournamentsListResponse>('/api/admin/tournaments', {
      params: queryParams,
    });
    
    if (response.data?.data?.tournaments && Array.isArray(response.data.data.tournaments)) {
      // Map _id to id for consistency, and format date if needed
      return response.data.data.tournaments.map((tournament) => ({
        ...tournament,
        id: tournament._id || tournament.id,
      }));
    }
    
    return [];
  },
};

