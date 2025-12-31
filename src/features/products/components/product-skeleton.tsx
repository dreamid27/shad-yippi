export function ProductSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="animate-pulse">
					<div className="aspect-[3/4] bg-gray-800 mb-4" />
					<div className="space-y-2">
						<div className="h-4 bg-gray-800 rounded w-3/4" />
						<div className="h-3 bg-gray-800 rounded w-1/2" />
						<div className="h-4 bg-gray-800 rounded w-1/4" />
					</div>
				</div>
			))}
		</div>
	)
}
