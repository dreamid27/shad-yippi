import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
	to?: string;
	onClick?: () => void;
	label?: string;
	showLabel?: boolean;
}

export function BackButton({
	to = "/",
	onClick,
	label = "BACK",
	showLabel = false,
}: BackButtonProps) {
	const content = (
		<>
			<ArrowLeft className="w-5 h-5" />
			{showLabel && (
				<span className="hidden md:inline text-sm font-medium tracking-wide">
					{label}
				</span>
			)}
		</>
	);

	if (onClick) {
		return (
			<button
				type="button"
				onClick={onClick}
				className="flex items-center gap-2 p-2 -ml-2 hover:bg-white/10 transition-colors"
				aria-label="Go back"
			>
				{content}
			</button>
		);
	}

	return (
		<Link
			to={to}
			className="flex items-center gap-2 hover:text-gray-300 transition-colors"
		>
			{content}
		</Link>
	);
}
