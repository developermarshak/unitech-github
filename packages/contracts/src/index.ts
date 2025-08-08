import { z } from "zod";

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
  path: z
    .string()
    .regex(/^[^\/]+\/[^\/]+$/, "Path must be in format owner/repo"),
});
export type CreateRepositoryRequest = z.infer<
  typeof createRepositoryRequestSchema
>;

/**
 * Validation schema and inferred-type for PUT /repositories
 */
export const updateRepositoryRequestSchema = z.object({
  id: z.string(),
});
export type UpdateRepositoryRequest = z.infer<
  typeof updateRepositoryRequestSchema
>;

/**
 * Response schema for a single Repository item
 */
export const repositoryResponseSchema = z.object({
  id: z.string(),
  projectPath: z.string(),
  stars: z.number().nullable(),
  forks: z.number().nullable(),
  issues: z.number().nullable(),
  notExist: z.boolean().nullable(),
  createdAt: z.string(), // ISO date string
});
export type RepositoryResponse = z.infer<typeof repositoryResponseSchema>;

/**
 * Response schema for GET /repositories
 */
export const getRepositoriesResponseSchema = z.array(repositoryResponseSchema);
export type GetRepositoriesResponse = z.infer<
  typeof getRepositoriesResponseSchema
>;
