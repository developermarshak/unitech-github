import { CreateSessionRequest, CreateUserRequest, GetRepositoriesResponse, getRepositoriesResponseSchema, CreateRepositoryRequest, UpdateRepositoryRequest } from "@repo/contracts";

let API_BASE_URL = '/api';

export function configureApiClient(options: { baseUrl: string }) {
  API_BASE_URL = options.baseUrl;
}

export const apiClient = {
  signup: async (data: CreateUserRequest) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed');
    }

    return response.status;
  },

  signin: async (data: CreateSessionRequest) => {
    const response = await fetch(`${API_BASE_URL}/users/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signin failed');
    }

    return response.json();
  },

  getRepositories: async (accessToken: string): Promise<GetRepositoriesResponse> => {
    const response = await fetch(`${API_BASE_URL}/repositories`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Fetching repositories failed');
    }

    const data = await response.json();
    return getRepositoriesResponseSchema.parse(data);
  },

  addRepository: async (accessToken: string, data: CreateRepositoryRequest) => {
    const response = await fetch(`${API_BASE_URL}/repositories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Add repository failed');
    }

    return response.status;
  },

  updateRepository: async (accessToken: string, data: UpdateRepositoryRequest) => {
    const response = await fetch(`${API_BASE_URL}/repositories`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Update repository failed');
    }

    return response.status;
  },

  deleteRepository: async (accessToken: string, repositoryId: string) => {
    const response = await fetch(`${API_BASE_URL}/repositories/${repositoryId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Delete repository failed');
    }

    return response.status;
  },
};
