import { z } from 'zod';
/**
 * Validation schema and inferred-type for POST /users
 */
export var createUserRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
/**
 * Validation schema and inferred-type for POST /users/session
 */
export var createSessionRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
