import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "@/stores/auth-store";

interface ProtectedRouteProps {
	children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const accessToken = useAuth((state) => state.accessToken);

	if (!accessToken) {
		return <Navigate to="/sign-in" replace={true} />;
	}

	return children;
}
