import * as z from "zod";

export const registerRequestSchema = z.object({
	fullName: z.string().min(2).optional(),
	email: z.email(),
	password: z.string().min(8),
});
export type RegisterRequestDto = z.infer<typeof registerRequestSchema>;

export const registerResponseSchema = z.object({
	id: z.uuid(),
	email: z.email(),
	fullName: z.string().nullable(),
});
export type RegisterResponseDto = z.infer<typeof registerResponseSchema>;

export const loginRequestSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});
export type LoginRequestDto = z.infer<typeof loginRequestSchema>;

export const loginResponseSchema = registerResponseSchema;
export type LoginResponseDto = z.infer<typeof loginResponseSchema>;
