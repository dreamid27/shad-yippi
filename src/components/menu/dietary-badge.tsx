import type { MenuItem } from "@/services/api";

interface DietaryBadgeProps {
	item: MenuItem;
}

export function DietaryBadge({ item }: DietaryBadgeProps) {
	const badges: Array<{
		label: string;
		show: boolean;
		bgColor: string;
		textColor: string;
	}> = [
		{
			label: "POPULAR",
			show: item.badges.popular,
			bgColor: "bg-black",
			textColor: "text-white",
		},
		{
			label: "CHEF SPECIAL",
			show: item.badges.chef_special,
			bgColor: "bg-gray-900",
			textColor: "text-white",
		},
		{
			label: "CUSTOMER CHOICE",
			show: item.badges.customer_choice,
			bgColor: "bg-gray-800",
			textColor: "text-white",
		},
		{
			label: "VEGAN",
			show: item.dietary.vegan,
			bgColor: "bg-black",
			textColor: "text-white",
		},
		{
			label: "VEGETARIAN",
			show: item.dietary.vegetarian,
			bgColor: "bg-gray-900",
			textColor: "text-white",
		},
		{
			label: "GLUTEN FREE",
			show: item.dietary.gluten_free,
			bgColor: "bg-gray-800",
			textColor: "text-white",
		},
	];

	const visibleBadges = badges.filter((b) => b.show);

	if (visibleBadges.length === 0) return null;

	return (
		<div className="flex flex-wrap gap-1.5 mt-3">
			{visibleBadges.slice(0, 3).map((badge, idx) => (
				<span
					key={idx}
					className={`px-2 py-1 text-[10px] font-bold tracking-tighter uppercase ${badge.bgColor} ${badge.textColor}`}
				>
					{badge.label}
				</span>
			))}
		</div>
	);
}
