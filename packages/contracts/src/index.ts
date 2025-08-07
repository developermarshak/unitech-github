import { z } from 'zod';

/**
 * Validation schema and inferred-type for POST /users
 */
export const createUserRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;

/**
 * Validation schema and inferred-type for POST /users/session
 */
export const createSessionRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type CreateSessionRequest = z.infer<typeof createSessionRequestSchema>;

/**
 * Validation schema and inferred-type for POST /repositories
 */
export const createRepositoryRequestSchema = z.object({
  path: z.string().regex(/^[^\/]+\/[^\/]+$/, 'Path must be in format owner/repo'),
});
export type CreateRepositoryRequest = z.infer<typeof createRepositoryRequestSchema>;

/**
 * Validation schema and inferred-type for PUT /repositories
 */
export const updateRepositoryRequestSchema = z.object({
  id: z.string(),
  path: z.string().regex(/^[^\/]+\/[^\/]+$/, 'Path must be in format owner/repo'),
});
export type UpdateRepositoryRequest = z.infer<typeof updateRepositoryRequestSchema>;
