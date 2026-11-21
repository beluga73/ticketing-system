import type { UserDto } from "@repo/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
	user: UserDto | null;
	accessToken: string | null;
};

type AuthAction = {
	setAuth: (user: UserDto, accessToken: string) => void;
	setAccessToken: (accessToken: string) => void;
	clear: () => void;
};

export const useAuth = create<AuthState & AuthAction>()(
	persist(
		(set) => ({
			user: null,
			accessToken: null,
			setAuth: (user, accessToken) =>
				set({
					user,
					accessToken,
				}),
			setAccessToken: (accessToken) => set({ accessToken }),
			clear: () => set({ user: null, accessToken: null }),
		}),
		{
			name: "auth",
			partialize: (state) => ({ user: state.user }),
		},
	),
);
