import { useAuth } from "@/stores/auth-store";
import { buildUrl } from "./api";

let inflight: Promise<boolean> | null = null;

export function refreshSession() {
	inflight ??= (async () => {
		try {
			const res = await fetch(buildUrl("/auth/refresh"), {
				method: "POST",
				credentials: "include",
			});
			if (!res.ok) {
				useAuth.getState().clear();
				return false;
			}
			const { accessToken } = await res.json();
			useAuth.getState().setAccessToken(accessToken);
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
