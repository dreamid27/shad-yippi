import { Flame } from "lucide-react";
import type { MenuItem } from "@/services/api";

interface SpiceIndicatorProps {
	item: MenuItem;
}

export function SpiceIndicator({ item }: SpiceIndicatorProps) {
	const spiceLevels = { mild: 1, medium: 2, hot: 3 };
	const level = spiceLevels[item.spice_level];

	return (
		<div className="flex gap-1 mt-2" title={`Spice level: ${item.spice_level}`}>
			{[1, 2, 3].map((i) => (
				<Flame
					key={i}
					className={`h-3 w-3 ${i <= level ? "fill-black text-black" : "text-gray-200"}`}
				/>
			))}
		</div>
	);
}
