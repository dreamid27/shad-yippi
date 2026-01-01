import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Menu, X } from "lucide-react";
import { HeaderBase } from "./header-base";

interface HomeHeaderProps {
	scrollY?: number;
}

export function HomeHeader({ scrollY = 0 }: HomeHeaderProps) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<>
			<HeaderBase
				scrollY={scrollY}
				transparentOnScroll={true}
				scrollThreshold={50}
			>
				{/* Logo */}
				<Link to="/" className="text-2xl font-black tracking-tighter">
					ÆTHER
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center space-x-12">
					<Link
						to="/categories"
						className="text-sm font-medium tracking-wide hover:text-gray-300 transition-colors"
					>
						COLLECTIONS
					</Link>
					<Link
						to="/categories"
						className="text-sm font-medium tracking-wide hover:text-gray-300 transition-colors"
					>
						NEW ARRIVALS
					</Link>
					<Link
						to="/categories"
						className="text-sm font-medium tracking-wide hover:text-gray-300 transition-colors"
					>
						CLOTHING
					</Link>
					<Link
						to="/categories"
						className="text-sm font-medium tracking-wide hover:text-gray-300 transition-colors"
					>
						FOOTWEAR
					</Link>
					<Link
						to="/categories"
						className="text-sm font-medium tracking-wide hover:text-gray-300 transition-colors"
					>
						ACCESSORIES
					</Link>
					<Link
						to="/categories"
						className="text-sm font-medium tracking-wide hover:text-gray-300 transition-colors"
					>
						EDITORIAL
					</Link>
				</div>

				{/* Search & Mobile Menu Toggle */}
				<div className="flex items-center space-x-4">
					<button
						type="button"
						className="p-2 hover:bg-white/10 rounded-full transition-colors"
					>
						<Search className="w-5 h-5" />
					</button>
					<button
						type="button"
						className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-label="Toggle menu"
					>
						{isMobileMenuOpen ? (
							<X className="w-5 h-5" />
						) : (
							<Menu className="w-5 h-5" />
						)}
					</button>
				</div>
			</HeaderBase>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden fixed top-[88px] left-0 right-0 bg-black border-b border-white/10 z-40">
					<div className="px-6 py-6 space-y-4">
						<Link
							to="/categories"
							className="block text-lg font-medium"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							COLLECTIONS
						</Link>
						<Link
							to="/categories"
							className="block text-lg font-medium"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							NEW ARRIVALS
						</Link>
						<Link
							to="/categories"
							className="block text-lg font-medium"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							CLOTHING
						</Link>
						<Link
							to="/categories"
							className="block text-lg font-medium"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							FOOTWEAR
						</Link>
						<Link
							to="/categories"
							className="block text-lg font-medium"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							ACCESSORIES
						</Link>
						<Link
							to="/categories"
							className="block text-lg font-medium"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							EDITORIAL
						</Link>
					</div>
				</div>
			)}
		</>
	);
}
