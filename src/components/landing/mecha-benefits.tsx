const benefits = [
	{
		title: "Pengembangan Cepat",
		description: "Metodologi agile untuk delivery yang lebih cepat",
		metric: "2x",
		metricLabel: "LEBIH CEPAT",
	},
	{
		title: "Skalabilitas Tinggi",
		description: "Arsitektur yang siap untuk pertumbuhan bisnis Anda",
		metric: "99.9%",
		metricLabel: "UPTIME",
	},
	{
		title: "Keamanan Maksimal",
		description: "Standar keamanan enterprise-grade",
		metric: "256",
		metricLabel: "BIT ENKRIPSI",
	},
	{
		title: "Biaya Efisien",
		description: "Solusi optimal dengan harga kompetitif",
		metric: "40%",
		metricLabel: "HEMAT BIAYA",
	},
];

const services = [
	"Aplikasi Mobile (iOS & Android)",
	"Aplikasi Web & Progressive Web Apps",
	"Backend & API Development",
	"Cloud Infrastructure & DevOps",
	"UI/UX Design System",
	"Maintenance & Support",
];

export function MechaBenefits() {
	return (
		<section
			id="benefits"
			className="relative py-24 lg:py-32 bg-[var(--mecha-black)] overflow-hidden"
		>
			{/* Background Elements */}
			<div className="absolute inset-0 tech-grid opacity-20" />

			{/* Decorative Lines */}
			<div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[var(--mecha-orange)]/20 to-transparent" />
			<div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-[var(--mecha-orange)]/10 to-transparent" />

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center mb-16 lg:mb-24">
					<div className="inline-flex items-center gap-4 mb-4">
						<div className="w-8 h-1 bg-[var(--mecha-orange)]" />
						<span
							className="text-[var(--mecha-orange)] text-sm tracking-[0.3em]"
							style={{ fontFamily: "var(--font-body)" }}
						>
							SECTION_02
						</span>
						<div className="w-8 h-1 bg-[var(--mecha-orange)]" />
					</div>
					<h2
						className="text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight"
						style={{ fontFamily: "var(--font-display)" }}
					>
						MANFAAT UNTUK
						<br />
						<span className="text-[var(--mecha-orange)]">BISNIS ANDA</span>
					</h2>
				</div>

				{/* Benefits Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
					{benefits.map((benefit, index) => (
						<div
							key={benefit.title}
							className="group relative bg-[var(--mecha-gray-dark)] border border-[var(--mecha-gray)] clip-mecha-panel-sm p-6 hover:border-[var(--mecha-orange)] transition-colors"
						>
							{/* Top Label */}
							<div className="flex items-center justify-between mb-6">
								<span
									className="text-[10px] text-[var(--mecha-gray)] tracking-wider"
									style={{ fontFamily: "var(--font-body)" }}
								>
									BENEFIT_{String(index + 1).padStart(2, "0")}
								</span>
								<div className="w-2 h-2 bg-[var(--mecha-orange)] group-hover:animate-mecha-pulse" />
							</div>

							{/* Metric */}
							<div className="mb-4">
								<span
									className="text-4xl lg:text-5xl font-black text-[var(--mecha-orange)]"
									style={{ fontFamily: "var(--font-display)" }}
								>
									{benefit.metric}
								</span>
								<span
									className="block text-[10px] text-[var(--mecha-panel)] tracking-wider mt-1"
									style={{ fontFamily: "var(--font-body)" }}
								>
									{benefit.metricLabel}
								</span>
							</div>

							{/* Content */}
							<h3
								className="text-lg font-bold text-white mb-2"
								style={{ fontFamily: "var(--font-heading)" }}
							>
								{benefit.title}
							</h3>
							<p
								className="text-sm text-[var(--mecha-panel-dark)]"
								style={{ fontFamily: "var(--font-body)" }}
							>
								{benefit.description}
							</p>

							{/* Corner Decoration */}
							<div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[var(--mecha-orange)] opacity-0 group-hover:opacity-100 transition-opacity" />
						</div>
					))}
				</div>

				{/* Services Section */}
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* Left - Services List */}
					<div>
						<h3
							className="text-2xl lg:text-3xl font-bold text-white mb-8 tracking-wide"
							style={{ fontFamily: "var(--font-heading)" }}
						>
							LAYANAN <span className="text-[var(--mecha-orange)]">KAMI</span>
						</h3>
						<div className="space-y-3">
							{services.map((service, index) => (
								<div
									key={service}
									className="group flex items-center gap-4 p-4 bg-[var(--mecha-gray-dark)]/50 border-l-2 border-[var(--mecha-gray)] hover:border-[var(--mecha-orange)] hover:bg-[var(--mecha-gray-dark)] transition-all"
								>
									<span
										className="text-[var(--mecha-orange)] text-sm"
										style={{ fontFamily: "var(--font-body)" }}
									>
										{String(index + 1).padStart(2, "0")}
									</span>
									<span
										className="text-[var(--mecha-panel)] group-hover:text-white transition-colors"
										style={{ fontFamily: "var(--font-body)" }}
									>
										{service}
									</span>
									<svg
										className="w-4 h-4 text-[var(--mecha-orange)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="square"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</div>
							))}
						</div>
					</div>

					{/* Right - Visual */}
					<div className="relative">
						<div className="relative bg-[var(--mecha-gray-dark)] border border-[var(--mecha-gray)] clip-mecha-panel p-8">
							{/* HUD Corners */}
							<div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-[var(--mecha-orange)]" />
							<div className="absolute top-4 right-8 w-6 h-6 border-r-2 border-t-2 border-[var(--mecha-orange)]" />
							<div className="absolute bottom-8 left-4 w-6 h-6 border-l-2 border-b-2 border-[var(--mecha-orange)]" />
							<div className="absolute bottom-4 right-8 w-6 h-6 border-r-2 border-b-2 border-[var(--mecha-orange)]" />

							<div className="text-center py-12">
								<div
									className="text-6xl lg:text-7xl font-black text-[var(--mecha-orange)] mb-4"
									style={{ fontFamily: "var(--font-display)" }}
								>
									100%
								</div>
								<div
									className="text-sm text-[var(--mecha-panel)] tracking-wider mb-8"
									style={{ fontFamily: "var(--font-body)" }}
								>
									KEPUASAN KLIEN
								</div>

								{/* Progress Bars */}
								<div className="space-y-4 max-w-xs mx-auto">
									<div>
										<div className="flex justify-between text-xs mb-1">
											<span
												className="text-[var(--mecha-panel-dark)]"
												style={{ fontFamily: "var(--font-body)" }}
											>
												KUALITAS
											</span>
											<span
												className="text-[var(--mecha-orange)]"
												style={{ fontFamily: "var(--font-body)" }}
											>
												98%
											</span>
										</div>
										<div className="h-2 bg-[var(--mecha-gray)] clip-mecha-button overflow-hidden">
											<div
												className="h-full bg-[var(--mecha-orange)]"
												style={{ width: "98%" }}
											/>
										</div>
									</div>
									<div>
										<div className="flex justify-between text-xs mb-1">
											<span
												className="text-[var(--mecha-panel-dark)]"
												style={{ fontFamily: "var(--font-body)" }}
											>
												KECEPATAN
											</span>
											<span
												className="text-[var(--mecha-orange)]"
												style={{ fontFamily: "var(--font-body)" }}
											>
												95%
											</span>
										</div>
										<div className="h-2 bg-[var(--mecha-gray)] clip-mecha-button overflow-hidden">
											<div
												className="h-full bg-[var(--mecha-orange)]"
												style={{ width: "95%" }}
											/>
										</div>
									</div>
									<div>
										<div className="flex justify-between text-xs mb-1">
											<span
												className="text-[var(--mecha-panel-dark)]"
												style={{ fontFamily: "var(--font-body)" }}
											>
												DUKUNGAN
											</span>
											<span
												className="text-[var(--mecha-orange)]"
												style={{ fontFamily: "var(--font-body)" }}
											>
												100%
											</span>
										</div>
										<div className="h-2 bg-[var(--mecha-gray)] clip-mecha-button overflow-hidden">
											<div
												className="h-full bg-[var(--mecha-orange)]"
												style={{ width: "100%" }}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Side Accent */}
						<div className="absolute -left-4 top-1/3 w-2 h-24 bg-[var(--mecha-orange)]" />
					</div>
				</div>
			</div>

			{/* Bottom Caution Stripe */}
			<div className="absolute bottom-0 left-0 right-0 h-2 caution-stripes" />
		</section>
	);
}
