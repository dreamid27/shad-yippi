import { Link } from "@tanstack/react-router";
import { BackButton } from "./back-button";
import { HeaderBase } from "./header-base";

interface MinimalHeaderProps {
	showLogo?: boolean;
	showBackButton?: boolean;
	showCart?: boolean;
}

export function MinimalHeader({
	showLogo = false,
	showBackButton = true,
	showCart = true,
}: MinimalHeaderProps) {
	return (
		<HeaderBase
			showCart={showCart}
			transparentOnScroll={false}
			className="border-b border-white/10"
		>
			{showLogo ? (
				<Link to="/" className="text-xl font-black tracking-tighter">
					ÆTHER
				</Link>
			) : showBackButton ? (
				<BackButton showLabel={true} />
			) : null}
		</HeaderBase>
	);
}
