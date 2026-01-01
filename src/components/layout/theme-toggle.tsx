import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<button
				type="button"
				className="p-2 hover:bg-white/10 rounded-full transition-colors"
				aria-label="Toggle theme"
			>
				<div className="w-5 h-5" />
			</button>
		);
	}

	const isDark = theme === "dark";

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 relative group"
			aria-label="Toggle theme"
		>
			<div className="relative w-5 h-5 overflow-hidden">
				<Sun
					className={`absolute transition-all duration-500 ease-in-out ${
						isDark
							? "rotate-90 scale-0 opacity-0"
							: "rotate-0 scale-100 opacity-100"
					}`}
					strokeWidth={2}
				/>
				<Moon
					className={`absolute transition-all duration-500 ease-in-out ${
						isDark
							? "rotate-0 scale-100 opacity-100"
							: "-rotate-90 scale-0 opacity-0"
					}`}
					strokeWidth={2}
				/>
			</div>
		</button>
	);
}
