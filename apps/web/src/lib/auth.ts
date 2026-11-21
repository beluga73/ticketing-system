import type { RefreshResponseDto } from "@repo/shared";
import { api } from "@/lib/api";
import { useAuth } from "@/stores/auth-store";

let inflight: Promise<boolean> | null = null;

export function refreshSession() {
	inflight ??= (async () => {
		try {
			// plain axios, not `api`: no interceptors, so a failed refresh can't loop
			const { data } = await api.post<RefreshResponseDto>("/auth/refresh");
			useAuth.getState().setAuth(data.user, data.accessToken);
			return true;
		} catch {
			useAuth.getState().clear();
			return false;
		} finally {
			inflight = null;
		}
	})();
	return inflight;
}
