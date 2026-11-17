import type { ReactNode } from "react";
import { Rings } from "@/components/rings";
import { cn } from "@/lib/utils";

type BrandPanelProps = {
	title: ReactNode;
	description?: ReactNode;
	className?: string;
};

/** Decorative side panel for auth screens: rings in the corner, tagline at the bottom. */
export function BrandPanel({ title, description, className }: BrandPanelProps) {
	return (
		<aside
			className={cn(
				"relative flex flex-col justify-end overflow-hidden bg-card p-12",
				className,
			)}
		>
			<Rings className="absolute top-26 right-26 translate-x-1/2 -translate-y-1/2" />
			<div className="relative max-w-sm space-y-3">
				<h2 className="font-heading text-3xl leading-tight font-bold tracking-tight">
					{title}
				</h2>
				{description && (
					<p className="text-sm text-muted-foreground">{description}</p>
				)}
			</div>
		</aside>
	);
}
