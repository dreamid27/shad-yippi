import { Button } from "@/components/ui/button"

interface PaginationProps {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	if (totalPages <= 1) return null

	return (
		<div className="flex items-center justify-center gap-2 py-8">
			<Button
				variant="outline"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="border-white/20 text-white hover:bg-white/10 hover:text-white rounded-none"
			>
				← PREVIOUS
			</Button>

			<div className="flex items-center gap-2">
				{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
					// Show first, last, current, and neighbors
					if (
						page === 1 ||
						page === totalPages ||
						(page >= currentPage - 1 && page <= currentPage + 1)
					) {
						return (
							<button
								key={page}
								onClick={() => onPageChange(page)}
								className={`w-10 h-10 border transition-all ${
									page === currentPage
										? "bg-white text-black border-white"
										: "border-white/20 hover:border-white/60"
								}`}
							>
								{page}
							</button>
						)
					}

					// Show ellipsis
					if (page === currentPage - 2 || page === currentPage + 2) {
						return (
							<span key={page} className="text-gray-400">
								...
							</span>
						)
					}

					return null
				})}
			</div>

			<Button
				variant="outline"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="border-white/20 text-white hover:bg-white/10 hover:text-white rounded-none"
			>
				NEXT →
			</Button>
		</div>
	)
}
