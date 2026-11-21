import { LoaderCircle } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { refreshSession } from "@/lib/auth";

export function SessionProvider({ children }: { children: ReactNode }) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		refreshSession().finally(() => setReady(true));
	}, []);

	if (!ready) {
		return (
			<div className="grid min-h-svh place-items-center text-muted-foreground">
				<LoaderCircle className="animate-spin" />
			</div>
		);
	}

	return children;
}
