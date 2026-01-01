import { useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SearchInput } from "./search-input";

interface SearchModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();
	const inputRef = useRef<HTMLInputElement>(null);

	// Focus input when modal opens
	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	// Close on escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, onClose]);

	const handleSearch = () => {
		if (searchQuery.trim()) {
			navigate({ to: "/categories", search: { search: searchQuery } });
			onClose();
			setSearchQuery("");
		}
	};

	if (!isOpen) return null;

	return (
		<>
			{/* Overlay */}
			<div
				className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
				<div
					className="relative w-full max-w-3xl bg-black border border-white/20 rounded-lg shadow-2xl p-6"
					role="dialog"
					aria-modal="true"
					aria-label="Search"
				>
					{/* Close Button */}
					<button
						type="button"
						onClick={onClose}
						className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
						aria-label="Close search"
					>
						<X className="w-6 h-6" />
					</button>

					{/* Search Input */}
					<div className="mb-6">
						<h2 className="text-2xl font-black mb-4 tracking-tighter">
							SEARCH PRODUCTS
						</h2>
						<SearchInput
							ref={inputRef}
							value={searchQuery}
							onChange={setSearchQuery}
							onClear={() => setSearchQuery("")}
							placeholder="What are you looking for?"
							className="text-lg"
						/>
						<p className="text-sm text-gray-400 mt-2">Press Enter to search</p>
					</div>

					{/* Search Button */}
					<button
						type="button"
						onClick={handleSearch}
						disabled={!searchQuery.trim()}
						className="w-full bg-white text-black hover:bg-gray-200 py-3 font-bold tracking-wide rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						SEARCH
					</button>

					{/* Popular Searches */}
					<div className="mt-8">
						<h3 className="text-sm font-bold mb-3 text-gray-400 tracking-wider">
							POPULAR SEARCHES
						</h3>
						<div className="flex flex-wrap gap-2">
							{["New Arrivals", "Jackets", "Dresses", "Sale"].map((term) => (
								<button
									key={term}
									type="button"
									onClick={() => {
										setSearchQuery(term);
										setTimeout(() => handleSearch(), 100);
									}}
									className="px-4 py-2 border border-white/20 hover:bg-white/10 rounded-full text-sm transition-colors"
								>
									{term}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
