import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useRepositories } from '../hooks/useRepositories';
import { RepositoryResponse } from '@repo/contracts';

export const RepositoryPage: React.FC = () => {
  const [repoInput, setRepoInput] = useState('');

  const {
    repositories,
    errors,
    isLoading,
    addRepository,
    updateRepository,
    removeRepository,
  } = useRepositories();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRepository(repoInput);
    if (!errors) {
      setRepoInput('');
    }
  };

  return (
    <Container component="main" sx={{ py: 4 }}>
      {/* Form to add new repository */}
      <Box component="form" onSubmit={handleAdd} mb={4}>
        <Box display="flex" gap={2} alignItems="flex-start">
          <Box flexGrow={1}>
            <TextField
              label="Repository (owner/name)"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              fullWidth
              error={!!errors}
              helperText={errors}
            />
          </Box>
          <Box flexShrink={0} minWidth="120px">
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
          </Box>
        </Box>
      </Box>

      {/* Repository cards */}
      <Box>
        {repositories.length === 0 && (
          <Typography variant="body1" color="text.secondary" align="center">
            No repositories yet. Add one above!
          </Typography>
        )}

        {repositories.map((repo: RepositoryResponse) => (
          <Card sx={{ borderRadius: 1, mb: 2 }} key={repo.id}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {repo.projectPath}
              </Typography>
              <Box mt={1}>
                {typeof repo.stars === 'number' && (
                  <Typography variant="caption" display="block">Stars: {repo.stars}</Typography>
                )}
                {typeof repo.forks === 'number' && (
                  <Typography variant="caption" display="block">Forks: {repo.forks}</Typography>
                )}
                {typeof repo.issues === 'number' && (
                  <Typography variant="caption" display="block">Issues: {repo.issues}</Typography>
                )}
                {repo.notExist && (
                  <Typography variant="caption" color="error" display="block">
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
                onClick={() => updateRepository(repo)}
                disabled={isLoading}
              >
                Update info
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => removeRepository(repo.id)}
                disabled={isLoading}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
};