const teamStats = [
	{ value: "25+", label: "DEVELOPER" },
	{ value: "8+", label: "TAHUN" },
	{ value: "150+", label: "PROYEK" },
	{ value: "12", label: "NEGARA" },
];

const technologies = [
	"React",
	"Next.js",
	"Node.js",
	"TypeScript",
	"Python",
	"Go",
	"AWS",
	"Docker",
	"Kubernetes",
	"PostgreSQL",
	"MongoDB",
	"Redis",
];

export function MechaAbout() {
	return (
		<section
			id="about"
			className="relative py-24 lg:py-32 bg-[var(--mecha-white)] overflow-hidden"
		>
			{/* Background Pattern */}
			<div className="absolute inset-0 tech-grid opacity-30" />

			{/* Large Background Text */}
			<div
				className="absolute -left-20 top-1/2 -translate-y-1/2 text-[30vw] font-black text-[var(--mecha-panel)] select-none pointer-events-none leading-none opacity-40 -rotate-90"
				style={{ fontFamily: "var(--font-display)" }}
			>
				ABOUT
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-16 items-center">
					{/* Left - Visual Panel */}
					<div className="relative order-2 lg:order-1">
						<div className="relative">
							{/* Main Panel */}
							<div className="relative bg-[var(--mecha-panel)] clip-mecha-panel p-8 lg:p-12">
								{/* Corner Decorations */}
								<div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[var(--mecha-black)]" />
								<div className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-[var(--mecha-orange)]" />

								{/* Content */}
								<div className="relative z-10">
									{/* Header */}
									<div className="flex items-center gap-3 mb-8">
										<div className="w-3 h-3 bg-[var(--mecha-orange)]" />
										<span
											className="text-xs text-[var(--mecha-gray)] tracking-wider"
											style={{ fontFamily: "var(--font-body)" }}
										>
											COMPANY_PROFILE
										</span>
									</div>

									{/* Stats Grid */}
									<div className="grid grid-cols-2 gap-6 mb-8">
										{teamStats.map((stat) => (
											<div
												key={stat.label}
												className="relative bg-[var(--mecha-white)] p-4 clip-mecha-panel-sm"
											>
												<div className="absolute top-2 right-2 w-2 h-2 bg-[var(--mecha-orange)]" />
												<span
													className="text-3xl lg:text-4xl font-black text-[var(--mecha-black)]"
													style={{ fontFamily: "var(--font-display)" }}
												>
													{stat.value}
												</span>
												<span
													className="block text-[10px] text-[var(--mecha-gray)] tracking-wider mt-1"
													style={{ fontFamily: "var(--font-body)" }}
												>
													{stat.label}
												</span>
											</div>
										))}
									</div>

									{/* Tech Stack */}
									<div>
										<span
											className="text-xs text-[var(--mecha-gray)] tracking-wider block mb-4"
											style={{ fontFamily: "var(--font-body)" }}
										>
											TECH_STACK
										</span>
										<div className="flex flex-wrap gap-2">
											{technologies.map((tech) => (
												<span
													key={tech}
													className="px-3 py-1.5 bg-[var(--mecha-white)] border border-[var(--mecha-panel-dark)] text-xs text-[var(--mecha-gray)] clip-mecha-button hover:border-[var(--mecha-orange)] hover:text-[var(--mecha-orange)] transition-colors cursor-default"
													style={{ fontFamily: "var(--font-body)" }}
												>
													{tech}
												</span>
											))}
										</div>
									</div>
								</div>
							</div>

							{/* Outer Frame */}
							<div className="absolute -inset-3 border border-[var(--mecha-panel-dark)] clip-mecha-panel pointer-events-none" />

							{/* Side Accents */}
							<div className="absolute -right-3 top-1/4 w-1.5 h-20 bg-[var(--mecha-orange)]" />
							<div className="absolute -left-3 bottom-1/3 w-1.5 h-16 bg-[var(--mecha-black)]" />
						</div>
					</div>

					{/* Right - Content */}
					<div className="order-1 lg:order-2">
						{/* Section Label */}
						<div className="flex items-center gap-4 mb-6">
							<div className="w-12 h-1 bg-[var(--mecha-orange)]" />
							<span
								className="text-[var(--mecha-orange)] text-sm tracking-[0.3em]"
								style={{ fontFamily: "var(--font-body)" }}
							>
								SECTION_03
							</span>
						</div>

						{/* Heading */}
						<h2
							className="text-4xl lg:text-5xl xl:text-6xl font-black text-[var(--mecha-black)] tracking-tight mb-8"
							style={{ fontFamily: "var(--font-display)" }}
						>
							TENTANG
							<br />
							<span className="text-[var(--mecha-orange)]">MECHADEV</span>
						</h2>

						{/* Description */}
						<div className="space-y-6 mb-10">
							<p
								className="text-[var(--mecha-gray)] text-base lg:text-lg leading-relaxed"
								style={{ fontFamily: "var(--font-body)" }}
							>
								MECHADEV adalah software agency yang berfokus pada pengembangan
								aplikasi berkualitas tinggi. Didirikan pada tahun 2016, kami
								telah membantu ratusan klien dari berbagai industri untuk
								mewujudkan visi digital mereka.
							</p>
							<p
								className="text-[var(--mecha-gray)] text-base lg:text-lg leading-relaxed"
								style={{ fontFamily: "var(--font-body)" }}
							>
								Tim kami terdiri dari developer, designer, dan project manager
								berpengalaman yang berkomitmen untuk memberikan solusi terbaik.
								Kami percaya bahwa teknologi yang baik adalah yang dapat
								memecahkan masalah nyata dengan cara yang elegan dan efisien.
							</p>
						</div>

						{/* Mission Box */}
						<div className="relative bg-[var(--mecha-black)] clip-mecha-panel p-6 lg:p-8 mb-10">
							<div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-[var(--mecha-orange)]" />
							<div className="absolute bottom-4 right-8 w-6 h-6 border-r-2 border-b-2 border-[var(--mecha-orange)]" />

							<div className="flex items-center gap-3 mb-4">
								<div className="w-2 h-2 bg-[var(--mecha-orange)] animate-mecha-pulse" />
								<span
									className="text-[var(--mecha-orange)] text-xs tracking-wider"
									style={{ fontFamily: "var(--font-body)" }}
								>
									MISI_KAMI
								</span>
							</div>
							<p
								className="text-white text-lg lg:text-xl leading-relaxed"
								style={{ fontFamily: "var(--font-heading)" }}
							>
								"Membangun aplikasi yang tidak hanya berfungsi dengan baik,
								tetapi juga memberikan pengalaman yang luar biasa bagi setiap
								pengguna."
							</p>
						</div>

						{/* CTA */}
						<a
							href="#contact"
							className="group inline-flex items-center gap-3 bg-[var(--mecha-orange)] text-white px-8 py-4 clip-mecha-button font-bold text-sm tracking-wider hover:bg-[var(--mecha-orange-dark)] transition-all"
							style={{ fontFamily: "var(--font-heading)" }}
						>
							<span className="w-3 h-3 border-2 border-white group-hover:bg-white transition-colors" />
							DISKUSI PROYEK ANDA
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

			{/* Bottom Decorative */}
			<div className="absolute bottom-0 left-0 right-0 flex">
				<div className="w-1/3 h-1 bg-[var(--mecha-orange)]" />
				<div className="flex-1 h-1 bg-[var(--mecha-black)]" />
			</div>
		</section>
	);
}
