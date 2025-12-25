import { Link } from "@tanstack/react-router";
import { useState } from "react";

const navLinks = [
	{ label: "BERANDA", href: "#hero" },
	{ label: "KEUNGGULAN", href: "#advantages" },
	{ label: "MANFAAT", href: "#benefits" },
	{ label: "TENTANG", href: "#about" },
	{ label: "TESTIMONI", href: "#testimonials" },
];

export function MechaNavbar() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--mecha-white)]/95 backdrop-blur-sm border-b-2 border-[var(--mecha-black)]">
			{/* Top accent line */}
			<div className="h-1 caution-stripes-sm" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<div className="flex items-center gap-3">
						<div className="relative">
							<div className="w-10 h-10 bg-[var(--mecha-black)] clip-mecha-panel-sm flex items-center justify-center">
								<span
									className="text-[var(--mecha-orange)] font-bold text-lg"
									style={{ fontFamily: "var(--font-display)" }}
								>
									M
								</span>
							</div>
							<div className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--mecha-orange)]" />
						</div>
						<div className="flex flex-col">
							<span
								className="text-[var(--mecha-black)] font-bold text-xl tracking-wider"
								style={{ fontFamily: "var(--font-display)" }}
							>
								MECHA<span className="text-[var(--mecha-orange)]">DEV</span>
							</span>
							<span
								className="text-[10px] text-[var(--mecha-gray)] tracking-[0.3em] -mt-1"
								style={{ fontFamily: "var(--font-body)" }}
							>
								UNIT-001
							</span>
						</div>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-1">
						{navLinks.map((link, index) => (
							<a
								key={link.href}
								href={link.href}
								className="group relative px-4 py-2 text-sm tracking-wider text-[var(--mecha-black)] hover:text-[var(--mecha-orange)] transition-colors"
								style={{ fontFamily: "var(--font-heading)" }}
							>
								<span className="text-[var(--mecha-orange)] text-[10px] mr-1">
									{String(index + 1).padStart(2, "0")}
								</span>
								{link.label}
								<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--mecha-orange)] group-hover:w-full transition-all duration-300" />
							</a>
						))}
					</div>

					{/* CTA Button */}
					<div className="hidden md:block">
						<a
							href="#contact"
							className="relative inline-flex items-center gap-2 bg-[var(--mecha-orange)] text-white px-6 py-2.5 clip-mecha-button font-semibold text-sm tracking-wider hover:bg-[var(--mecha-orange-dark)] transition-colors"
							style={{ fontFamily: "var(--font-heading)" }}
						>
							<span className="w-2 h-2 bg-white animate-mecha-pulse" />
							HUBUNGI KAMI
						</a>
					</div>

					{/* Mobile Menu Button */}
					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						className="md:hidden w-10 h-10 bg-[var(--mecha-black)] clip-mecha-panel-sm flex flex-col items-center justify-center gap-1.5"
					>
						<span
							className={`w-5 h-0.5 bg-[var(--mecha-orange)] transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`}
						/>
						<span
							className={`w-5 h-0.5 bg-[var(--mecha-orange)] transition-opacity ${isOpen ? "opacity-0" : ""}`}
						/>
						<span
							className={`w-5 h-0.5 bg-[var(--mecha-orange)] transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
						/>
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			<div
				className={`md:hidden bg-[var(--mecha-white)] border-t border-[var(--mecha-panel-dark)] transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
			>
				<div className="px-4 py-4 space-y-2">
					{navLinks.map((link, index) => (
						<a
							key={link.href}
							href={link.href}
							className="flex items-center gap-3 px-4 py-3 bg-[var(--mecha-panel)] clip-mecha-panel-sm text-[var(--mecha-black)] hover:bg-[var(--mecha-orange)] hover:text-white transition-colors"
							style={{ fontFamily: "var(--font-heading)" }}
							onClick={() => setIsOpen(false)}
						>
							<span className="text-[var(--mecha-orange)] text-xs font-mono">
								{String(index + 1).padStart(2, "0")}
							</span>
							<span className="tracking-wider">{link.label}</span>
						</a>
					))}
					<a
						href="#contact"
						className="flex items-center justify-center gap-2 bg-[var(--mecha-orange)] text-white px-6 py-3 clip-mecha-button font-semibold tracking-wider mt-4"
						style={{ fontFamily: "var(--font-heading)" }}
						onClick={() => setIsOpen(false)}
					>
						<span className="w-2 h-2 bg-white animate-mecha-pulse" />
						HUBUNGI KAMI
					</a>
				</div>
			</div>
		</nav>
	);
}
