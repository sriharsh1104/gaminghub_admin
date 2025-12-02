import apiClient from './client';

export interface GenerateLobbyRequest {
  dateType: string; // Will be date string or 'nextDay'
  timeSlots: string[];
  mode: string;
  subModes: string[];
  region: string;
}

export interface GenerateLobbyResponse {
  status: number;
  success: boolean;
  message: string;
  data?: unknown;
}

export const lobbyApi = {
  /**
   * Generate lobbies with custom parameters (Admin only)
   * @param request - Lobby generation parameters
   */
  generateLobbies: async (request: GenerateLobbyRequest): Promise<GenerateLobbyResponse> => {
    const response = await apiClient.post<GenerateLobbyResponse>('/api/admin/generate-lobbies', request);
    return response.data;
  },
};

