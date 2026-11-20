import * as z from "zod";

export const signUpRequestSchema = z.object({
	fullName: z.string().min(2).optional(),
	email: z.email(),
	password: z.string().min(8),
});
export type SignUpRequestDto = z.infer<typeof signUpRequestSchema>;

export const signUpResponseSchema = z.object({
	id: z.uuid(),
	email: z.email(),
	fullName: z.string().nullable(),
});
export type SignUpResponseDto = z.infer<typeof signUpResponseSchema>;

export const signInRequestSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});
export type SignInRequestDto = z.infer<typeof signInRequestSchema>;

export const signInResponseSchema = signUpResponseSchema;
export type SignInResponseDto = z.infer<typeof signInResponseSchema>;
