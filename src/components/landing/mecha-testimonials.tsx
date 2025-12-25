const testimonials = [
	{
		id: "T-001",
		name: "Budi Santoso",
		role: "CEO, TechCorp Indonesia",
		content:
			"MECHADEV berhasil mengembangkan aplikasi mobile kami dalam waktu yang sangat singkat tanpa mengorbankan kualitas. Tim mereka sangat profesional dan responsif.",
		rating: 5,
		project: "Mobile App",
	},
	{
		id: "T-002",
		name: "Sari Dewi",
		role: "CTO, StartupXYZ",
		content:
			"Kolaborasi dengan MECHADEV adalah pengalaman yang luar biasa. Mereka tidak hanya memenuhi ekspektasi kami, tetapi melampaui apa yang kami bayangkan.",
		rating: 5,
		project: "Web Platform",
	},
	{
		id: "T-003",
		name: "Ahmad Rizki",
		role: "Founder, DigitalFirst",
		content:
			"Kami sudah bekerja sama dengan beberapa agency sebelumnya, tetapi MECHADEV adalah yang terbaik. Kualitas kode mereka sangat tinggi dan dokumentasinya lengkap.",
		rating: 5,
		project: "Enterprise System",
	},
	{
		id: "T-004",
		name: "Maya Putri",
		role: "Product Manager, E-Commerce Co",
		content:
			"Platform e-commerce yang dikembangkan MECHADEV mampu menangani ribuan transaksi per hari dengan performa yang sangat stabil. Sangat merekomendasikan!",
		rating: 5,
		project: "E-Commerce",
	},
];

export function MechaTestimonials() {
	return (
		<section
			id="testimonials"
			className="relative py-24 lg:py-32 bg-[var(--mecha-panel)] overflow-hidden"
		>
			{/* Background Pattern */}
			<div className="absolute inset-0 panel-lines opacity-20" />

			{/* Large Background Number */}
			<div
				className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 text-[50vw] font-black text-[var(--mecha-white)] select-none pointer-events-none leading-none opacity-60"
				style={{ fontFamily: "var(--font-display)" }}
			>
				04
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center mb-16 lg:mb-24">
					<div className="inline-flex items-center gap-4 mb-4">
						<div className="w-8 h-1 bg-[var(--mecha-orange)]" />
						<span
							className="text-[var(--mecha-orange)] text-sm tracking-[0.3em]"
							style={{ fontFamily: "var(--font-body)" }}
						>
							SECTION_04
						</span>
						<div className="w-8 h-1 bg-[var(--mecha-orange)]" />
					</div>
					<h2
						className="text-4xl lg:text-5xl xl:text-6xl font-black text-[var(--mecha-black)] tracking-tight"
						style={{ fontFamily: "var(--font-display)" }}
					>
						APA KATA
						<br />
						<span className="text-[var(--mecha-orange)]">KLIEN KAMI</span>
					</h2>
				</div>

				{/* Testimonials Grid */}
				<div className="grid md:grid-cols-2 gap-6 lg:gap-8">
					{testimonials.map((testimonial, index) => (
						<div
							key={testimonial.id}
							className="group relative bg-[var(--mecha-white)] clip-mecha-panel"
						>
							{/* Top Bar */}
							<div className="flex items-center justify-between px-6 py-3 bg-[var(--mecha-black)]">
								<div className="flex items-center gap-3">
									<div className="w-2 h-2 bg-[var(--mecha-success)] animate-mecha-pulse" />
									<span
										className="text-[var(--mecha-orange)] text-xs tracking-wider"
										style={{ fontFamily: "var(--font-body)" }}
									>
										{testimonial.id}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span
										className="text-[10px] text-[var(--mecha-panel-dark)] tracking-wider"
										style={{ fontFamily: "var(--font-body)" }}
									>
										PROJECT:
									</span>
									<span
										className="text-[10px] text-[var(--mecha-orange)]"
										style={{ fontFamily: "var(--font-body)" }}
									>
										{testimonial.project}
									</span>
								</div>
							</div>

							{/* Content */}
							<div className="p-6 lg:p-8">
								{/* Rating */}
								<div className="flex items-center gap-1 mb-4">
									{[...Array(testimonial.rating)].map((_, i) => (
										<svg
											key={i}
											className="w-4 h-4 text-[var(--mecha-orange)]"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
										</svg>
									))}
								</div>

								{/* Quote */}
								<blockquote
									className="text-[var(--mecha-gray)] text-sm lg:text-base leading-relaxed mb-6"
									style={{ fontFamily: "var(--font-body)" }}
								>
									"{testimonial.content}"
								</blockquote>

								{/* Author */}
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 bg-[var(--mecha-panel)] clip-mecha-panel-sm flex items-center justify-center">
										<span
											className="text-[var(--mecha-black)] font-bold text-lg"
											style={{ fontFamily: "var(--font-display)" }}
										>
											{testimonial.name.charAt(0)}
										</span>
									</div>
									<div>
										<span
											className="block text-[var(--mecha-black)] font-bold tracking-wide"
											style={{ fontFamily: "var(--font-heading)" }}
										>
											{testimonial.name}
										</span>
										<span
											className="text-xs text-[var(--mecha-gray)]"
											style={{ fontFamily: "var(--font-body)" }}
										>
											{testimonial.role}
										</span>
									</div>
								</div>
							</div>

							{/* Bottom Accent */}
							<div className="absolute bottom-0 left-0 w-0 h-1 bg-[var(--mecha-orange)] group-hover:w-full transition-all duration-500" />

							{/* Corner Number */}
							<div
								className="absolute bottom-4 right-4 text-4xl font-black text-[var(--mecha-panel)] opacity-50"
								style={{ fontFamily: "var(--font-display)" }}
							>
								{String(index + 1).padStart(2, "0")}
							</div>
						</div>
					))}
				</div>

				{/* CTA Section */}
				<div className="mt-16 lg:mt-24 text-center">
					<div className="inline-block relative bg-[var(--mecha-black)] clip-mecha-panel p-8 lg:p-12">
						{/* Corners */}
						<div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-[var(--mecha-orange)]" />
						<div className="absolute bottom-8 right-8 w-6 h-6 border-r-2 border-b-2 border-[var(--mecha-orange)]" />

						<h3
							className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-wide"
							style={{ fontFamily: "var(--font-heading)" }}
						>
							SIAP MENJADI KLIEN SELANJUTNYA?
						</h3>
						<p
							className="text-[var(--mecha-panel)] text-sm mb-8 max-w-md mx-auto"
							style={{ fontFamily: "var(--font-body)" }}
						>
							Bergabunglah dengan ratusan klien yang telah mempercayakan
							pengembangan aplikasi mereka kepada MECHADEV.
						</p>
						<a
							href="#contact"
							className="group inline-flex items-center gap-3 bg-[var(--mecha-orange)] text-white px-8 py-4 clip-mecha-button font-bold text-sm tracking-wider hover:bg-[var(--mecha-orange-dark)] transition-all"
							style={{ fontFamily: "var(--font-heading)" }}
						>
							<span className="w-3 h-3 border-2 border-white group-hover:bg-white transition-colors" />
							KONSULTASI GRATIS
							<svg
								className="w-4 h-4 group-hover:translate-x-1 transition-transform"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="square"
									strokeWidth={2}
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								/>
							</svg>
						</a>
					</div>
				</div>
			</div>

			{/* Bottom Line */}
			<div className="absolute bottom-0 left-0 right-0 flex">
				<div className="flex-1 h-1 bg-[var(--mecha-black)]" />
				<div className="w-64 h-1 bg-[var(--mecha-orange)]" />
				<div className="flex-1 h-1 bg-[var(--mecha-black)]" />
			</div>
		</section>
	);
}
