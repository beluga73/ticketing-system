import * as z from "zod";

export const registerSchema = z.object({
	fullName: z.string().min(2),
	email: z.email(),
	password: z.string().min(8),
});
export type RegisterDto = z.infer<typeof registerSchema>;
