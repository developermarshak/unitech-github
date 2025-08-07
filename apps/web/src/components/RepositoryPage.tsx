import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

import { apiClient } from '@repo/api-client';
import { RepositoryResponse, CreateRepositoryRequest, UpdateRepositoryRequest } from '@repo/contracts';

interface RepositoryPageProps {
  accessToken: string;
}

export const RepositoryPage: React.FC<RepositoryPageProps> = ({ accessToken }) => {
  const [repositories, setRepositories] = useState<RepositoryResponse[]>([]);
  const [repoInput, setRepoInput] = useState('');
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRepositories = async () => {
    try {
      const data = await apiClient.getRepositories(accessToken);
      setRepositories(data);
    } catch (err: any) {
      setErrors(err.message || 'Failed to load repositories');
    }
  };

  useEffect(() => {
    fetchRepositories();
    // We intentionally omit fetchRepositories from deps array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const handleAddRepository = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = repoInput.trim();
    if (!trimmed) {
      setErrors('Repository path is required');
      return;
    }

    // Check duplicates
    if (repositories.some((r) => r.projectPath.toLowerCase() === trimmed.toLowerCase())) {
      setErrors('Repository already added');
      return;
    }

    setIsLoading(true);
    try {
      const payload: CreateRepositoryRequest = { path: trimmed };
      await apiClient.addRepository(accessToken, payload);
      setRepoInput('');
      setErrors(null);
      await fetchRepositories();
    } catch (err: any) {
      setErrors(err.message || 'Failed to add repository');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRepository = async (repo: RepositoryResponse) => {
    setIsLoading(true);
    try {
      const payload: UpdateRepositoryRequest = { id: repo.id };
      await apiClient.updateRepository(accessToken, payload);
      await fetchRepositories();
    } catch (err: any) {
      setErrors(err.message || 'Failed to update repository');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveRepository = async (repoId: string) => {
    setIsLoading(true);
    try {
      await apiClient.deleteRepository(accessToken, repoId);
      await fetchRepositories();
    } catch (err: any) {
      setErrors(err.message || 'Failed to remove repository');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
      {/* Form to add new repository */}
      <Box component="form" onSubmit={handleAddRepository} mb={4}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8} sm={9}>
            <TextField
              label="Repository (owner/name)"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              fullWidth
              error={!!errors}
              helperText={errors}
            />
          </Grid>
          <Grid item xs={4} sm={3}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              sx={{ height: '56px' }}
              disabled={isLoading}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Repository cards */}
      <Grid container spacing={2}>
        {repositories.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No repositories yet. Add one above!
            </Typography>
          </Grid>
        )}

        {repositories.map((repo) => (
          <Grid item xs={12} key={repo.id}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {repo.projectPath}
                </Typography>
                <Box mt={1} display="flex" gap={2} flexWrap="wrap">
                  {typeof repo.stars === 'number' && (
                    <Typography variant="caption">⭐ {repo.stars}</Typography>
                  )}
                  {typeof repo.forks === 'number' && (
                    <Typography variant="caption">🍴 {repo.forks}</Typography>
                  )}
                  {typeof repo.issues === 'number' && (
                    <Typography variant="caption">🐞 {repo.issues}</Typography>
                  )}
                  {repo.notExist && (
                    <Typography variant="caption" color="error">
                      Not found
                    </Typography>
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  Added {new Date(repo.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                <Button
                  size="small"
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={() => handleUpdateRepository(repo)}
                  disabled={isLoading}
                >
                  Update info
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemoveRepository(repo.id)}
                  disabled={isLoading}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};