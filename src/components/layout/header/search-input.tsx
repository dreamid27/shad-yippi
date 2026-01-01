import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { forwardRef } from "react";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	onClear?: () => void;
	placeholder?: string;
	className?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
	(
		{
			value,
			onChange,
			onClear,
			placeholder = "SEARCH...",
			className = "",
		}: SearchInputProps,
		ref,
	) => {
		const handleClear = () => {
			onChange("");
			onClear?.();
		};

		return (
			<div className="flex items-center gap-3">
				<Input
					ref={ref}
					type="search"
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className={`flex-1 bg-transparent border-white/20 text-white placeholder:text-gray-500 rounded-none h-10 ${className}`}
				/>
				{value && (
					<Button
						variant="ghost"
						size="icon"
						onClick={handleClear}
						className="p-2 hover:bg-white/10 transition-colors"
						aria-label="Clear search"
					>
						<X className="w-5 h-5" />
					</Button>
				)}
			</div>
		);
	},
);

SearchInput.displayName = "SearchInput";
