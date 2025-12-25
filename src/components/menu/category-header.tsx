import type { MenuCategory } from '@/services/api'

interface CategoryHeaderProps {
	category: MenuCategory | null
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
	if (!category) {
		return (
			<div className="px-4 py-8 bg-gray-50 border-b border-gray-200">
				<h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">ALL ITEMS</h1>
				<p className="text-gray-600 font-medium">Browse our complete menu</p>
			</div>
		)
	}

	return (
		<div className="px-4 py-8 bg-gray-50 border-b border-gray-200">
			<h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
				{category.display_name.toUpperCase()}
			</h1>
			<p className="text-gray-600 font-medium">{category.description}</p>
		</div>
	)
}
