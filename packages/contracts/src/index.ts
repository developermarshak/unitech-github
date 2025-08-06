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

export type CreateRepoRequest = {
  repoName: string;
};
