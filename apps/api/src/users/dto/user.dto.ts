import * as z from "zod";

export const userSchema = z.object({
	id: z.uuid(),
	email: z.email(),
	fullName: z.string().min(2).nullable(),
});
export type UserDto = z.infer<typeof userSchema>;
