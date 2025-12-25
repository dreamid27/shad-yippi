const advantages = [
	{
		id: "01",
		title: "TEKNOLOGI TERDEPAN",
		description:
			"Menggunakan stack teknologi modern dan framework terbaru untuk memastikan aplikasi Anda siap menghadapi tantangan masa depan.",
		icon: (
			<svg
				className="w-8 h-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="square"
					strokeWidth={1.5}
					d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
				/>
			</svg>
		),
	},
	{
		id: "02",
		title: "TIM BERPENGALAMAN",
		description:
			"Didukung oleh developer senior dengan pengalaman lebih dari 8 tahun dalam berbagai proyek skala enterprise.",
		icon: (
			<svg
				className="w-8 h-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="square"
					strokeWidth={1.5}
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
				/>
			</svg>
		),
	},
	{
		id: "03",
		title: "KUALITAS TERJAMIN",
		description:
			"Proses QA ketat dengan automated testing dan code review untuk memastikan setiap baris kode memenuhi standar tertinggi.",
		icon: (
			<svg
				className="w-8 h-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="square"
					strokeWidth={1.5}
					d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
				/>
			</svg>
		),
	},
	{
		id: "04",
		title: "DUKUNGAN 24/7",
		description:
			"Tim support kami siap membantu kapan saja. Respons cepat dan solusi tepat untuk menjaga sistem Anda tetap berjalan.",
		icon: (
			<svg
				className="w-8 h-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="square"
					strokeWidth={1.5}
					d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
		),
	},
];

export function MechaAdvantages() {
	return (
		<section
			id="advantages"
			className="relative py-24 lg:py-32 bg-[var(--mecha-panel)] overflow-hidden"
		>
			{/* Background Pattern */}
			<div className="absolute inset-0 panel-lines opacity-30" />

			{/* Large Background Number */}
			<div
				className="absolute -right-20 top-1/2 -translate-y-1/2 text-[40vw] font-black text-[var(--mecha-white)] select-none pointer-events-none leading-none opacity-50"
				style={{ fontFamily: "var(--font-display)" }}
			>
				01
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="mb-16 lg:mb-24">
					<div className="flex items-center gap-4 mb-4">
						<div className="w-16 h-1 bg-[var(--mecha-orange)]" />
						<span
							className="text-[var(--mecha-orange)] text-sm tracking-[0.3em]"
							style={{ fontFamily: "var(--font-body)" }}
						>
							SECTION_01
						</span>
					</div>
					<h2
						className="text-4xl lg:text-5xl xl:text-6xl font-black text-[var(--mecha-black)] tracking-tight"
						style={{ fontFamily: "var(--font-display)" }}
					>
						KEUNGGULAN
						<br />
						<span className="text-[var(--mecha-orange)]">KAMI</span>
					</h2>
				</div>

				{/* Advantages Grid */}
				<div className="grid md:grid-cols-2 gap-6 lg:gap-8">
					{advantages.map((advantage, index) => (
						<div
							key={advantage.id}
							className="group relative bg-[var(--mecha-white)] clip-mecha-panel p-8 lg:p-10 hover:bg-[var(--mecha-black)] transition-colors duration-300"
							style={{ animationDelay: `${index * 100}ms` }}
						>
							{/* Corner Accent */}
							<div className="absolute top-0 right-0 w-16 h-16">
								<div className="absolute top-0 right-0 w-full h-full bg-[var(--mecha-orange)] clip-mecha-right opacity-0 group-hover:opacity-100 transition-opacity" />
							</div>

							{/* Number */}
							<div
								className="absolute top-6 right-8 text-6xl font-black text-[var(--mecha-panel)] group-hover:text-[var(--mecha-gray)] transition-colors"
								style={{ fontFamily: "var(--font-display)" }}
							>
								{advantage.id}
							</div>

							{/* Icon */}
							<div className="relative mb-6">
								<div className="w-16 h-16 bg-[var(--mecha-black)] group-hover:bg-[var(--mecha-orange)] clip-mecha-panel-sm flex items-center justify-center text-[var(--mecha-orange)] group-hover:text-white transition-colors">
									{advantage.icon}
								</div>
								<div className="absolute -bottom-2 -right-2 w-4 h-4 border-2 border-[var(--mecha-orange)]" />
							</div>

							{/* Content */}
							<h3
								className="text-xl lg:text-2xl font-bold text-[var(--mecha-black)] group-hover:text-white mb-4 tracking-wide transition-colors"
								style={{ fontFamily: "var(--font-heading)" }}
							>
								{advantage.title}
							</h3>
							<p
								className="text-[var(--mecha-gray)] group-hover:text-[var(--mecha-panel)] text-sm leading-relaxed transition-colors"
								style={{ fontFamily: "var(--font-body)" }}
							>
								{advantage.description}
							</p>

							{/* Bottom Line */}
							<div className="absolute bottom-0 left-0 w-0 h-1 bg-[var(--mecha-orange)] group-hover:w-full transition-all duration-500" />
						</div>
					))}
				</div>
			</div>

			{/* Bottom Decorative Line */}
			<div className="absolute bottom-0 left-0 right-0 flex">
				<div className="flex-1 h-1 bg-[var(--mecha-black)]" />
				<div className="w-48 h-1 bg-[var(--mecha-orange)]" />
				<div className="flex-1 h-1 bg-[var(--mecha-black)]" />
			</div>
		</section>
	);
}
