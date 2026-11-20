import * as z from "zod";
import { userSchema } from "@/users/dto/user.dto.js";

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

export const signInRequestSchema = userSchema
	.pick({ email: true })
	.extend({ password: z.string() });
export type SignInRequestDto = z.infer<typeof signInRequestSchema>;

export const signInResponseSchema = userSchema;
export type SignInResponseDto = z.infer<typeof signInResponseSchema>;
