import {
  CreateSessionRequest,
  CreateUserRequest,
  GetRepositoriesResponse,
  getRepositoriesResponseSchema,
  CreateRepositoryRequest,
  UpdateRepositoryRequest,
} from "@repo/contracts";

let API_BASE_URL = "/api";
let ACCESS_TOKEN: string | null = null;

// Helper function to handle common request patterns
async function makeRequest(
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    requireAuth?: boolean;
  } = {},
) {
  const { method = "GET", body, requireAuth = true } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (requireAuth && ACCESS_TOKEN) {
    headers["Authorization"] = `Bearer ${ACCESS_TOKEN}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    let error = `Request failed with status ${response.status}`;
    if (errorData.error === "Validation Error") {
      error = errorData.details[0]?.message || "Validation Error";
    } else if (errorData.message) {
      error = errorData.message;
    }
    throw new Error(error);
  }

  return response;
}

export function configureApiClient(options: {
  baseUrl?: string;
  accessToken?: string;
}) {
  if (options.baseUrl) {
    API_BASE_URL = options.baseUrl;
  }
  if (options.accessToken) {
    ACCESS_TOKEN = options.accessToken;
  }
}

export function setAccessToken(token: string | null) {
  ACCESS_TOKEN = token;
}

export const apiClient = {
  signup: async (data: CreateUserRequest) => {
    const response = await makeRequest("/users", {
      method: "POST",
      body: data,
      requireAuth: false,
    });
    return response.status;
  },

  signin: async (data: CreateSessionRequest) => {
    const response = await makeRequest("/users/session", {
      method: "POST",
      body: data,
      requireAuth: false,
    });
    return response.json();
  },

  getRepositories: async (): Promise<GetRepositoriesResponse> => {
    const response = await makeRequest("/repositories");
    const data = await response.json();
    return getRepositoriesResponseSchema.parse(data);
  },

  addRepository: async (data: CreateRepositoryRequest) => {
    const response = await makeRequest("/repositories", {
      method: "POST",
      body: data,
    });
    return response.status;
  },

  updateRepository: async (data: UpdateRepositoryRequest) => {
    const response = await makeRequest("/repositories", {
      method: "PUT",
      body: data,
    });
    return response.status;
  },

  deleteRepository: async (repositoryId: string) => {
    const response = await makeRequest(`/repositories/${repositoryId}`, {
      method: "DELETE",
    });
    return response.status;
  },
};
