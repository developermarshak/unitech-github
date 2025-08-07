import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@repo/api-client';
import {
  RepositoryResponse,
  CreateRepositoryRequest,
  UpdateRepositoryRequest,
} from '@repo/contracts';

interface UseRepositoriesReturn {
  repositories: RepositorySchema[];
  errors: string | null;
  isLoading: boolean;
  addRepository: (path: string) => Promise<void>;
  updateRepository: (repoId: string) => Promise<void>;
  removeRepository: (repoId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export interface RepositorySchema {
    id: string;
    projectPath: string;
    owner: string;
    name: string;
    updating: boolean;
    createdAt: string;
    url: string | null;
    stars: number | null;
    forks: number | null;
    issues: number | null;
    notExist: boolean | null;
}

export const useRepositories = (): UseRepositoriesReturn => {
  const [repositories, setRepositories] = useState<RepositorySchema[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const transformRepository = (repo: RepositoryResponse): RepositorySchema => {
    const url = repo.notExist ? null : `https://github.com/${repo.projectPath}`;

    const [owner, name] = repo.projectPath.split('/');

    return {
      id: repo.id,
      projectPath: repo.projectPath,
      owner: owner,
      name: name,
      updating: repo.stars === null && repo.forks === null && repo.issues === null && repo.notExist === null,
      createdAt: repo.createdAt,
      url: url,
      stars: repo.stars,
      forks: repo.forks,
      issues: repo.issues,
      notExist: repo.notExist,
    };
  };

  const fetchRepositories = useCallback(async () => {
    try {
      const data = await apiClient.getRepositories();

      const transformedRepositories = data.map(transformRepository);

      setRepositories(transformedRepositories);
      setIsUpdating(transformedRepositories.some(r => r.updating));
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

  const updateRepository = async (repoId: string) => {
    setIsLoading(true);
    try {
      const payload: UpdateRepositoryRequest = { id: repoId };
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

  useEffect(() => {
    if (isUpdating) {
      const interval = setInterval(() => {
        fetchRepositories();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isUpdating, fetchRepositories]);

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