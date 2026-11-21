import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
	id: string;
	email: string;
	fullName?: string;
};

type AuthState = {
	user: User | null;
	accessToken: string | null;
};

type AuthAction = {
	setAuth: (user: User, accessToken: string) => void;
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
