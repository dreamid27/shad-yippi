import { useState } from "react";
import { Search } from "lucide-react";
import { HeaderBase } from "./header-base";
import { BackButton } from "./back-button";
import { SearchInput } from "./search-input";

interface PageHeaderProps {
	title: string;
	showBackButton?: boolean;
	showSearch?: boolean;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	onSearchClear?: () => void;
	showMobileSearchToggle?: boolean;
	className?: string;
}

export function PageHeader({
	title,
	showBackButton = true,
	showSearch = true,
	searchValue = "",
	onSearchChange,
	onSearchClear,
	showMobileSearchToggle = true,
	className = "",
}: PageHeaderProps) {
	const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);

	if (isMobileSearchActive) {
		// Mobile search active state
		return (
			<HeaderBase
				showCart={false}
				className={className}
				transparentOnScroll={false}
			>
				<div className="flex items-center gap-3 w-full md:hidden">
					<button
						type="button"
						onClick={() => {
							setIsMobileSearchActive(false);
							onSearchClear?.();
						}}
						className="p-2 -ml-2 hover:bg-white/10 transition-colors"
						aria-label="Close search"
					>
						<BackButton />
					</button>
					<SearchInput
						value={searchValue}
						onChange={onSearchChange || (() => {})}
						onClear={onSearchClear}
						className="flex-1"
					/>
				</div>
			</HeaderBase>
		);
	}

	return (
		<HeaderBase transparentOnScroll={false} className={className}>
			<div className="flex items-center gap-4 md:gap-6">
				{/* Left side */}
				<div className="flex items-center gap-4 md:gap-6">
					{showBackButton && <BackButton />}
					<div className="hidden md:block h-5 w-px bg-white/20" />
					<h1 className="text-lg md:text-xl font-black tracking-tighter">
						{title}
					</h1>
				</div>

				{/* Right side */}
				<div className="flex items-center gap-2 md:gap-4">
					{/* Desktop Search */}
					{showSearch && onSearchChange && (
						<div className="hidden md:block">
							<SearchInput
								value={searchValue}
								onChange={onSearchChange}
								onClear={onSearchClear}
								className="w-64"
							/>
						</div>
					)}

					{/* Mobile Search Toggle */}
					{showSearch && showMobileSearchToggle && onSearchChange && (
						<button
							type="button"
							onClick={() => setIsMobileSearchActive(true)}
							className="md:hidden p-2 hover:bg-white/10 transition-colors"
							aria-label="Open search"
						>
							<Search className="w-5 h-5" />
						</button>
					)}
				</div>
			</div>
		</HeaderBase>
	);
}
