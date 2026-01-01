import { useEffect, useState } from "react";
import { CartIcon } from "./cart-icon";

interface HeaderBaseProps {
	children: React.ReactNode;
	className?: string;
	showCart?: boolean;
	transparentOnScroll?: boolean;
	scrollThreshold?: number;
	scrollY?: number; // Allow parent to control scroll state
}

export function HeaderBase({
	children,
	className = "",
	showCart = true,
	transparentOnScroll = false,
	scrollThreshold = 50,
	scrollY: controlledScrollY,
}: HeaderBaseProps) {
	const [internalScrollY, setInternalScrollY] = useState(0);

	// Use controlled scroll if provided, otherwise use internal state
	const scrollY = controlledScrollY ?? internalScrollY;

	// Set up scroll listener only if not controlled
	useEffect(() => {
		if (controlledScrollY !== undefined) {
			return; // Parent controls scroll
		}

		const handleScroll = () => setInternalScrollY(window.scrollY);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [controlledScrollY]);

	// Determine background class
	const backgroundClass =
		transparentOnScroll && scrollY <= scrollThreshold
			? "bg-transparent"
			: "bg-black/90 backdrop-blur-lg border-b border-white/10";

	return (
		<nav
			className={`fixed top-0 w-full z-50 transition-all duration-300 ${backgroundClass} ${className}`}
		>
			<div className="max-w-7xl mx-auto px-6 py-6">
				<div className="flex items-center justify-between">
					{children}

					{showCart && <CartIcon />}
				</div>
			</div>
		</nav>
	);
}
