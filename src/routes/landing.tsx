import { createFileRoute } from "@tanstack/react-router";
import {
	MechaNavbar,
	MechaHero,
	MechaAdvantages,
	MechaBenefits,
	MechaAbout,
	MechaTestimonials,
	MechaFooter,
} from "@/components/landing";

export const Route = createFileRoute("/landing")({
	component: LandingPage,
	head: () => ({
		meta: [
			{
				title: "MECHADEV | Software Agency - Membangun Aplikasi Masa Depan",
			},
			{
				name: "description",
				content:
					"MECHADEV adalah software agency yang berfokus pada pengembangan aplikasi berkualitas tinggi. Teknologi canggih, eksekusi presisi, hasil maksimal.",
			},
		],
	}),
});

function LandingPage() {
	return (
		<div className="min-h-screen bg-[var(--mecha-white)]">
			<MechaNavbar />
			<main>
				<MechaHero />
				<MechaAdvantages />
				<MechaBenefits />
				<MechaAbout />
				<MechaTestimonials />
			</main>
			<MechaFooter />
		</div>
	);
}
