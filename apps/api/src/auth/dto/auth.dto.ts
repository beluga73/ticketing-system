import * as z from "zod";
import { userSchema } from "@/users/dto/user.dto.js";

// SignUp
export const signUpRequestSchema = userSchema
	.pick({ email: true, fullName: true })
	.partial({ fullName: true })
	.extend({ password: z.string().min(8) });
export type SignUpRequestDto = z.infer<typeof signUpRequestSchema>;
export const signUpResponseSchema = z.object({
	user: userSchema,
	accessToken: z.string(),
});
export type SignUpResponseDto = z.infer<typeof signUpResponseSchema>;

// SignIn
export const signInRequestSchema = signUpRequestSchema.omit({ fullName: true });
export type SignInRequestDto = z.infer<typeof signInRequestSchema>;
export const signInResponseSchema = signUpResponseSchema;
export type SignInResponseDto = z.infer<typeof signInResponseSchema>;

// Refresh
export const refreshResponseSchema = signInResponseSchema;
export type RefreshResponseDto = z.infer<typeof refreshResponseSchema>;
