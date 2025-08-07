import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@repo/api-client';
import {
  RepositoryResponse,
  CreateRepositoryRequest,
  UpdateRepositoryRequest,
} from '@repo/contracts';


interface UseRepositoriesReturn {
  repositories: RepositoryResponse[];
  errors: string | null;
  isLoading: boolean;
  addRepository: (path: string) => Promise<void>;
  updateRepository: (repo: RepositoryResponse) => Promise<void>;
  removeRepository: (repoId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useRepositories = (): UseRepositoriesReturn => {
  const [repositories, setRepositories] = useState<RepositoryResponse[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRepositories = useCallback(async () => {
    try {
      const data = await apiClient.getRepositories();
      

      setRepositories(data);
    } catch (err: any) {
      setErrors(err.message || 'Failed to load repositories');
    }
  }, []);

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  const addRepository = async (path: string) => {
    const trimmed = path.trim();

    if (!trimmed) {
      setErrors('Repository path is required');
      return;
    }

    if (
      repositories.some(
        (r) => r.projectPath.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setErrors('Repository already added');
      return;
    }

    setIsLoading(true);
    try {
      const payload: CreateRepositoryRequest = { path: trimmed };
      await apiClient.addRepository(payload);
      await fetchRepositories();
      setErrors(null);
    } catch (err: any) {
      setErrors(err.message || 'Failed to add repository');
    } finally {
      setIsLoading(false);
    }
  };

  const updateRepository = async (repo: RepositoryResponse) => {
    setIsLoading(true);
    try {
      const payload: UpdateRepositoryRequest = { id: repo.id };
      await apiClient.updateRepository(payload);
      await fetchRepositories();
    } catch (err: any) {
      setErrors(err.message || 'Failed to update repository');
    } finally {
      setIsLoading(false);
    }
  };

  const removeRepository = async (repoId: string) => {
    setIsLoading(true);
    try {
      await apiClient.deleteRepository(repoId);
      await fetchRepositories();
    } catch (err: any) {
      setErrors(err.message || 'Failed to remove repository');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    repositories,
    errors,
    isLoading,
    addRepository,
    updateRepository,
    removeRepository,
    refetch: fetchRepositories,
  };
};