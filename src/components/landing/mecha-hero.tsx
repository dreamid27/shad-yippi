export function MechaHero() {
	return (
		<section
			id="hero"
			className="relative min-h-screen bg-[var(--mecha-white)] pt-20 overflow-hidden"
		>
			{/* Background Grid */}
			<div className="absolute inset-0 tech-grid opacity-50" />

			{/* Decorative Elements */}
			<div className="absolute top-32 left-0 w-32 h-1 bg-[var(--mecha-orange)]" />
			<div className="absolute top-32 left-0 w-1 h-32 bg-[var(--mecha-orange)]" />
			<div className="absolute bottom-32 right-0 w-48 h-1 bg-[var(--mecha-black)]" />
			<div className="absolute bottom-32 right-0 w-1 h-48 bg-[var(--mecha-black)]" />

			{/* Large Background Text */}
			<div
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-[var(--mecha-panel)] select-none pointer-events-none opacity-50"
				style={{ fontFamily: "var(--font-display)" }}
			>
				DEV
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					{/* Left Column - Text Content */}
					<div className="animate-slide-in-left">
						{/* Unit Label */}
						<div className="inline-flex items-center gap-3 mb-6">
							<div className="caution-stripes-sm h-6 w-2" />
							<span
								className="text-[var(--mecha-orange)] text-sm tracking-[0.4em] font-medium"
								style={{ fontFamily: "var(--font-body)" }}
							>
								MODEL_RX-2024
							</span>
							<div className="h-px w-20 bg-[var(--mecha-orange)]" />
						</div>

						{/* Main Heading */}
						<h1
							className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-[var(--mecha-black)] leading-[0.9] tracking-tight mb-6"
							style={{ fontFamily: "var(--font-display)" }}
						>
							MEMBANGUN
							<br />
							<span className="text-[var(--mecha-orange)]">APLIKASI</span>
							<br />
							MASA DEPAN
						</h1>

						{/* Description */}
						<p
							className="text-[var(--mecha-gray)] text-base lg:text-lg leading-relaxed mb-8 max-w-lg"
							style={{ fontFamily: "var(--font-body)" }}
						>
							Kami adalah tim pengembang berpengalaman yang menghadirkan solusi
							aplikasi inovatif. Teknologi canggih, eksekusi presisi, hasil
							maksimal.
						</p>

						{/* Stats Row */}
						<div className="flex gap-8 mb-10">
							<div className="relative">
								<div className="absolute -left-3 top-0 w-1 h-full bg-[var(--mecha-orange)]" />
								<span
									className="text-3xl lg:text-4xl font-black text-[var(--mecha-black)]"
									style={{ fontFamily: "var(--font-display)" }}
								>
									150+
								</span>
								<p
									className="text-xs text-[var(--mecha-gray)] tracking-wider"
									style={{ fontFamily: "var(--font-body)" }}
								>
									PROYEK SELESAI
								</p>
							</div>
							<div className="relative">
								<div className="absolute -left-3 top-0 w-1 h-full bg-[var(--mecha-orange)]" />
								<span
									className="text-3xl lg:text-4xl font-black text-[var(--mecha-black)]"
									style={{ fontFamily: "var(--font-display)" }}
								>
									8+
								</span>
								<p
									className="text-xs text-[var(--mecha-gray)] tracking-wider"
									style={{ fontFamily: "var(--font-body)" }}
								>
									TAHUN PENGALAMAN
								</p>
							</div>
							<div className="relative">
								<div className="absolute -left-3 top-0 w-1 h-full bg-[var(--mecha-orange)]" />
								<span
									className="text-3xl lg:text-4xl font-black text-[var(--mecha-black)]"
									style={{ fontFamily: "var(--font-display)" }}
								>
									50+
								</span>
								<p
									className="text-xs text-[var(--mecha-gray)] tracking-wider"
									style={{ fontFamily: "var(--font-body)" }}
								>
									KLIEN PUAS
								</p>
							</div>
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-wrap gap-4">
							<a
								href="#contact"
								className="group relative inline-flex items-center gap-3 bg-[var(--mecha-orange)] text-white px-8 py-4 clip-mecha-button font-bold text-sm tracking-wider hover:bg-[var(--mecha-orange-dark)] transition-all"
								style={{ fontFamily: "var(--font-heading)" }}
							>
								<span className="w-3 h-3 border-2 border-white group-hover:bg-white transition-colors" />
								MULAI PROYEK
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
							<a
								href="#about"
								className="group inline-flex items-center gap-3 bg-transparent border-2 border-[var(--mecha-black)] text-[var(--mecha-black)] px-8 py-4 clip-mecha-button font-bold text-sm tracking-wider hover:bg-[var(--mecha-black)] hover:text-white transition-all"
								style={{ fontFamily: "var(--font-heading)" }}
							>
								PELAJARI LEBIH
							</a>
						</div>
					</div>

					{/* Right Column - Visual Element */}
					<div className="relative animate-slide-in-right">
						{/* Main Visual Container */}
						<div className="relative">
							{/* Outer Frame */}
							<div className="absolute -inset-4 border-2 border-[var(--mecha-panel-dark)] clip-mecha-panel" />

							{/* Main Panel */}
							<div className="relative bg-[var(--mecha-panel)] clip-mecha-panel p-8 lg:p-12">
								{/* Corner Decorations */}
								<div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[var(--mecha-orange)]" />
								<div className="absolute top-4 right-8 w-8 h-8 border-r-2 border-t-2 border-[var(--mecha-orange)]" />
								<div className="absolute bottom-8 left-4 w-8 h-8 border-l-2 border-b-2 border-[var(--mecha-orange)]" />
								<div className="absolute bottom-4 right-8 w-8 h-8 border-r-2 border-b-2 border-[var(--mecha-orange)]" />

								{/* Status Bar */}
								<div className="flex items-center justify-between mb-6">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-[var(--mecha-success)] animate-mecha-pulse" />
										<span
											className="text-xs text-[var(--mecha-gray)] tracking-wider"
											style={{ fontFamily: "var(--font-body)" }}
										>
											SYSTEM_ACTIVE
										</span>
									</div>
									<span
										className="text-xs text-[var(--mecha-orange)]"
										style={{ fontFamily: "var(--font-body)" }}
									>
										v2.4.1
									</span>
								</div>

								{/* Tech Visual */}
								<div className="relative aspect-square bg-[var(--mecha-white)] clip-mecha-panel-sm overflow-hidden">
									{/* Grid Lines */}
									<div className="absolute inset-0 tech-grid" />

									{/* Center Element */}
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="relative">
											{/* Outer Ring */}
											<div className="w-48 h-48 border-4 border-[var(--mecha-orange)]/30 rounded-full" />
											{/* Middle Ring */}
											<div className="absolute inset-4 border-2 border-[var(--mecha-black)]/20 rounded-full" />
											{/* Inner Ring */}
											<div className="absolute inset-8 border-2 border-[var(--mecha-orange)] rounded-full animate-mecha-glow" />
											{/* Center */}
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="w-16 h-16 bg-[var(--mecha-black)] clip-mecha-panel-sm flex items-center justify-center">
													<span
														className="text-[var(--mecha-orange)] text-2xl font-black"
														style={{ fontFamily: "var(--font-display)" }}
													>
														M
													</span>
												</div>
											</div>
										</div>
									</div>

									{/* Scanning Line */}
									<div className="absolute inset-0 overflow-hidden pointer-events-none">
										<div className="w-full h-1 bg-gradient-to-b from-transparent via-[var(--mecha-orange)]/50 to-transparent animate-mecha-scan" />
									</div>

									{/* Corner Data */}
									<div
										className="absolute top-4 left-4 text-[10px] text-[var(--mecha-gray)]"
										style={{ fontFamily: "var(--font-body)" }}
									>
										<div>X: 127.45</div>
										<div>Y: 089.32</div>
									</div>
									<div
										className="absolute top-4 right-4 text-[10px] text-[var(--mecha-orange)] text-right"
										style={{ fontFamily: "var(--font-body)" }}
									>
										<div>PWR: 100%</div>
										<div>SYS: OK</div>
									</div>
									<div
										className="absolute bottom-4 left-4 text-[10px] text-[var(--mecha-gray)]"
										style={{ fontFamily: "var(--font-body)" }}
									>
										<div>UNIT: RX-78</div>
									</div>
									<div
										className="absolute bottom-4 right-4 text-[10px] text-[var(--mecha-gray)]"
										style={{ fontFamily: "var(--font-body)" }}
									>
										<div>CORE: ACTIVE</div>
									</div>
								</div>

								{/* Bottom Info */}
								<div className="mt-6 flex items-center justify-between">
									<div className="flex gap-4">
										<div className="flex items-center gap-2">
											<div className="w-3 h-3 bg-[var(--mecha-orange)]" />
											<span
												className="text-[10px] text-[var(--mecha-gray)]"
												style={{ fontFamily: "var(--font-body)" }}
											>
												MOBILE
											</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="w-3 h-3 bg-[var(--mecha-black)]" />
											<span
												className="text-[10px] text-[var(--mecha-gray)]"
												style={{ fontFamily: "var(--font-body)" }}
											>
												WEB
											</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="w-3 h-3 border-2 border-[var(--mecha-orange)]" />
											<span
												className="text-[10px] text-[var(--mecha-gray)]"
												style={{ fontFamily: "var(--font-body)" }}
											>
												API
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Side Accent */}
							<div className="absolute -right-4 top-1/4 w-2 h-32 bg-[var(--mecha-orange)]" />
							<div className="absolute -left-4 bottom-1/4 w-2 h-24 bg-[var(--mecha-black)]" />
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Caution Stripe */}
			<div className="absolute bottom-0 left-0 right-0 h-2 caution-stripes" />
		</section>
	);
}
