import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface CartIconProps {
	className?: string;
}

export function CartIcon({ className = "" }: CartIconProps) {
	const { itemCount } = useCart();

	return (
		<Link
			to="/cart"
			className={`relative p-2 hover:bg-white/10 rounded-full transition-colors ${className}`}
			aria-label="Shopping cart"
		>
			<ShoppingBag className="w-5 h-5" />
			{itemCount > 0 && (
				<span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-white text-black text-xs font-black rounded-sm">
					{itemCount}
				</span>
			)}
		</Link>
	);
}
