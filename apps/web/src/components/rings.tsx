import { cn } from "@/lib/utils";

type RingsProps = {
	/** Number of concentric circles. */
	count?: number;
	/** Radius of the innermost circle, in px. */
	startRadius?: number;
	/** Distance between circles, in px. */
	step?: number;
	className?: string;
};

/**
 * Decorative concentric circles. Stroke color follows `currentColor`,
 * so tint it with a text color class. Position it from the parent.
 */
export function Rings({
	count = 4,
	startRadius = 72,
	step = 48,
	className,
}: RingsProps) {
	const maxRadius = startRadius + step * (count - 1);
	const size = (maxRadius + 1) * 2;
	const center = size / 2;

	return (
		<svg
			aria-hidden="true"
			focusable="false"
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			fill="none"
			stroke="currentColor"
			strokeWidth={1}
			className={cn(
				"pointer-events-none max-w-none shrink-0 text-primary/40",
				className,
			)}
		>
			{Array.from({ length: count }, (_, index) => (
				<circle
					// biome-ignore lint/suspicious/noArrayIndexKey: static list, never reordered
					key={index}
					cx={center}
					cy={center}
					r={startRadius + step * index}
				/>
			))}
		</svg>
	);
}
