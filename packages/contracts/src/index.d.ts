import { z } from 'zod';
/**
 * Validation schema and inferred-type for POST /users
 */
export declare const createUserRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
/**
 * Validation schema and inferred-type for POST /users/session
 */
export declare const createSessionRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type CreateSessionRequest = z.infer<typeof createSessionRequestSchema>;
export type CreateRepoRequest = {
    repoName: string;
};
//# sourceMappingURL=index.d.ts.map