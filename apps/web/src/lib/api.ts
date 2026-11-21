import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuth } from "@/stores/auth-store";
import { refreshSession } from "./auth";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});

const AUTH_PATHS = ["/auth/sign-in", "/auth/sign-up", "/auth/refresh"];

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.request.use((config) => {
	const token = useAuth.getState().accessToken;
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

api.interceptors.response.use(
	(response) => response, // 2xx
	async (error) => {
		if (!axios.isAxiosError(error) || error.response?.status !== 401) {
			return Promise.reject(error);
		}

		const original = error.config as RetriableConfig | undefined;
		if (
			!original ||
			original._retry ||
			AUTH_PATHS.some((path) => original.url?.startsWith(path))
		) {
			return Promise.reject(error);
		}
		original._retry = true;

		const refreshed = await refreshSession();
		if (!refreshed) return Promise.reject(error);

		return api(original);
	},
);
