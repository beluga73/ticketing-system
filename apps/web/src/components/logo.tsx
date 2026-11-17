import { SquarePlus } from "lucide-react";
import { Link } from "react-router";

export function Logo() {
	return (
		<Link to="/" className="flex items-center gap-2">
			<SquarePlus className="size-6 text-primary" strokeWidth={2.5} />
			<span className="font-heading text-lg font-bold tracking-tight">
				Dropline
			</span>
		</Link>
	);
}
