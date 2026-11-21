import type { RefreshResponseDto } from "@repo/shared";
import { useAuth } from "@/stores/auth-store";
import { api } from "./api";

let inflight: Promise<boolean> | null = null;

export function refreshSession() {
	inflight ??= (async () => {
		try {
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
