import { API_BASE_URL } from "./api/config";

export interface Brand {
	id: string;
	name: string;
	created_at: string;
	updated_at: string;
}

export interface Category {
	id: string;
	name: string;
	parent_id?: string;
	created_at: string;
	updated_at: string;
}

export interface BrandsResponse {
	$schema: string;
	brands: Brand[];
}

export interface CategoriesResponse {
	$schema: string;
	categories: Category[];
}

// Menu System Interfaces
export interface MenuItem {
	id: string;
	name: string;
	price: number;
	description: string;
	category: string;
	subcategory?: string;
	photos: string[];
	dietary: {
		vegan: boolean;
		vegetarian: boolean;
		gluten_free: boolean;
		halal: boolean;
	};
	allergens: string[];
	spice_level: "mild" | "medium" | "hot";
	badges: {
		popular: boolean;
		chef_special: boolean;
		customer_choice: boolean;
	};
	pairings: {
		wines: string[];
		drinks: string[];
	};
	reviews: {
		rating: number;
		count: number;
	};
	seasonal_availability?: {
		available: boolean;
		start_date?: string;
		end_date?: string;
	};
	created_at: string;
	updated_at: string;
}

export interface MenuCategory {
	id: string;
	name: string;
	display_name: string;
	description: string;
	order: number;
	subcategories?: {
		id: string;
		name: string;
		display_name: string;
	}[];
}

export interface MenuResponse {
	$schema: string;
	categories: MenuCategory[];
	items: MenuItem[];
}

export async function fetchBrands(): Promise<Brand[]> {
	try {
		const response = await fetch(`${API_BASE_URL}/brands`);
		if (!response.ok) {
			throw new Error(`Failed to fetch brands: ${response.statusText}`);
		}
		const data: BrandsResponse = await response.json();
		return data.brands;
	} catch (error) {
		console.error("Error fetching brands:", error);
		return [];
	}
}

export async function fetchCategories(): Promise<Category[]> {
	try {
		const response = await fetch(`${API_BASE_URL}/categories`);
		if (!response.ok) {
			throw new Error(`Failed to fetch categories: ${response.statusText}`);
		}
		const data: CategoriesResponse = await response.json();
		return data.categories;
	} catch (error) {
		console.error("Error fetching categories:", error);
		return [];
	}
}

// Mock Data for Menu System
const mockMenuCategories: MenuCategory[] = [
	{
		id: "garden",
		name: "from-the-garden",
		display_name: "From the Garden",
		description: "Fresh appetizers and salads from our local farms",
		order: 1,
		subcategories: [
			{ id: "appetizers", name: "appetizers", display_name: "Appetizers" },
			{ id: "salads", name: "salads", display_name: "Salads" },
		],
	},
	{
		id: "fields",
		name: "fields-and-pastures",
		display_name: "Fields & Pastures",
		description: "Premium meats from ethical local farms",
		order: 2,
	},
	{
		id: "ocean",
		name: "oceans-bounty",
		display_name: "Ocean's Bounty",
		description: "Sustainable seafood from local waters",
		order: 3,
	},
	{
		id: "harvest",
		name: "harvest-specials",
		display_name: "Harvest Specials",
		description: "Seasonal dishes featuring peak ingredients",
		order: 4,
	},
	{
		id: "sweet",
		name: "sweet-endings",
		display_name: "Sweet Endings",
		description: "Artisanal desserts and sweet treats",
		order: 5,
	},
	{
		id: "beverages",
		name: "artisan-beverages",
		display_name: "Artisan Beverages",
		description: "Craft cocktails, wines, and non-alcoholic delights",
		order: 6,
	},
];

const mockMenuItems: MenuItem[] = [
	{
		id: "1",
		name: "Heirloom Tomato & Burrata",
		price: 16,
		description:
			"Fresh heirloom tomatoes from Green Valley Farm, house-made burrata, basil oil, aged balsamic",
		category: "garden",
		subcategory: "appetizers",
		photos: [
			"https://images.unsplash.com/photo-1525373612132-b3e820b87cea?w=800&h=600&fit=crop",
			"https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&h=600&fit=crop",
		],
		dietary: {
			vegan: false,
			vegetarian: true,
			gluten_free: true,
			halal: true,
		},
		allergens: ["dairy"],
		spice_level: "mild",
		badges: {
			popular: true,
			chef_special: false,
			customer_choice: true,
		},
		pairings: {
			wines: ["Sauvignon Blanc", "Pinot Grigio"],
			drinks: ["House Lemonade", "Sparkling Water"],
		},
		reviews: {
			rating: 4.8,
			count: 124,
		},
		created_at: "2024-01-01T00:00:00Z",
		updated_at: "2024-01-01T00:00:00Z",
	},
	{
		id: "2",
		name: "Farmhouse Soup du Jour",
		price: 9,
		description:
			"Daily changing soup featuring seasonal vegetables from our partner farms",
		category: "garden",
		subcategory: "appetizers",
		photos: [
			"https://images.unsplash.com/photo-1547592166-3ac2475a36c5?w=800&h=600&fit=crop",
		],
		dietary: {
			vegan: true,
			vegetarian: true,
			gluten_free: true,
			halal: true,
		},
		allergens: [],
		spice_level: "mild",
		badges: {
			popular: false,
			chef_special: false,
			customer_choice: false,
		},
		pairings: {
			wines: ["Chardonnay", "Chenin Blanc"],
			drinks: ["Herbal Tea", "Fresh Bread"],
		},
		reviews: {
			rating: 4.5,
			count: 89,
		},
		seasonal_availability: {
			available: true,
			start_date: "2024-01-01",
			end_date: "2024-12-31",
		},
		created_at: "2024-01-01T00:00:00Z",
		updated_at: "2024-01-01T00:00:00Z",
	},
	{
		id: "3",
		name: "Grass-Fed Ribeye",
		price: 42,
		description:
			"28-day dry-aged ribeye from Meadowridge Ranch, roasted garlic purée, herb-roasted potatoes, seasonal vegetables",
		category: "fields",
		photos: [
			"https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
			"https://images.unsplash.com/photo-1558030006-4436c3079b4e?w=800&h=600&fit=crop",
		],
		dietary: {
			vegan: false,
			vegetarian: false,
			gluten_free: true,
			halal: false,
		},
		allergens: [],
		spice_level: "mild",
		badges: {
			popular: true,
			chef_special: true,
			customer_choice: true,
		},
		pairings: {
			wines: ["Cabernet Sauvignon", "Malbec"],
			drinks: ["Craft Beer Selection", "Red Wine"],
		},
		reviews: {
			rating: 4.9,
			count: 256,
		},
		created_at: "2024-01-01T00:00:00Z",
		updated_at: "2024-01-01T00:00:00Z",
	},
	{
		id: "4",
		name: "Pan-Seared Salmon",
		price: 28,
		description:
			"Wild-caught salmon, lemon-dill sauce, quinoa pilaf, grilled asparagus",
		category: "ocean",
		photos: [
			"https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop",
			"https://images.unsplash.com/photo-1504542965128-2a8a40418902?w=800&h=600&fit=crop",
		],
		dietary: {
			vegan: false,
			vegetarian: false,
			gluten_free: true,
			halal: true,
		},
		allergens: ["fish"],
		spice_level: "mild",
		badges: {
			popular: false,
			chef_special: false,
			customer_choice: false,
		},
		pairings: {
			wines: ["Pinot Noir", "Chardonnay"],
			drinks: ["White Wine", "Sparkling Water"],
		},
		reviews: {
			rating: 4.6,
			count: 178,
		},
		created_at: "2024-01-01T00:00:00Z",
		updated_at: "2024-01-01T00:00:00Z",
	},
	{
		id: "5",
		name: "Spicy Thai Curry",
		price: 24,
		description:
			"Red curry with seasonal vegetables, coconut milk, jasmine rice, fresh herbs",
		category: "harvest",
		photos: [
			"https://images.unsplash.com/photo-1565299624946-b28f40a0fbb3?w=800&h=600&fit=crop",
			"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
		],
		dietary: {
			vegan: true,
			vegetarian: true,
			gluten_free: true,
			halal: true,
		},
		allergens: ["coconut", "soy"],
		spice_level: "hot",
		badges: {
			popular: true,
			chef_special: false,
			customer_choice: false,
		},
		pairings: {
			wines: ["Riesling", "Gewürztraminer"],
			drinks: ["Thai Iced Tea", "Coconut Water"],
		},
		reviews: {
			rating: 4.4,
			count: 92,
		},
		created_at: "2024-01-01T00:00:00Z",
		updated_at: "2024-01-01T00:00:00Z",
	},
	{
		id: "6",
		name: "Chocolate Lava Cake",
		price: 12,
		description:
			"Warm chocolate cake with molten center, vanilla bean ice cream, fresh berries",
		category: "sweet",
		photos: [
			"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop",
			"https://images.unsplash.com/photo-1488900128323-21503983a07a?w=800&h=600&fit=crop",
		],
		dietary: {
			vegan: false,
			vegetarian: true,
			gluten_free: false,
			halal: true,
		},
		allergens: ["dairy", "egg", "gluten"],
		spice_level: "mild",
		badges: {
			popular: true,
			chef_special: true,
			customer_choice: true,
		},
		pairings: {
			wines: ["Port Wine", "Moscato"],
			drinks: ["Espresso", "Cappuccino"],
		},
		reviews: {
			rating: 4.9,
			count: 342,
		},
		created_at: "2024-01-01T00:00:00Z",
		updated_at: "2024-01-01T00:00:00Z",
	},
	{
		id: "7",
		name: "Farm-to-Table Cocktail",
		price: 14,
		description:
			"House-made infusion with seasonal fruits, herbs from our garden, premium spirits",
		category: "beverages",
		photos: [
			"https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=600&fit=crop",
		],
		dietary: {
			vegan: true,
			vegetarian: true,
			gluten_free: true,
			halal: true,
		},
		allergens: [],
		spice_level: "mild",
		badges: {
			popular: false,
			chef_special: true,
			customer_choice: false,
		},
		pairings: {
			wines: [],
			drinks: ["Small Plates", "Appetizers"],
		},
		reviews: {
			rating: 4.7,
			count: 67,
		},
		created_at: "2024-01-01T00:00:00Z",
		updated_at: "2024-01-01T00:00:00Z",
	},
];

// Menu API Functions with Mock Data
export async function fetchMenuCategories(): Promise<MenuCategory[]> {
	// In production, this would be: const response = await fetch(`${API_BASE_URL}/menu/categories`)
	// For now, return mock data with a simulated delay

	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(mockMenuCategories);
		}, 300); // Simulate network delay
	});
}

export async function fetchMenuItems(category?: string): Promise<MenuItem[]> {
	// In production, this would be: const response = await fetch(`${API_BASE_URL}/menu/items${category ? `?category=${category}` : ''}`)
	// For now, return filtered mock data with simulated delay

	return new Promise((resolve) => {
		setTimeout(() => {
			const filteredItems = category
				? mockMenuItems.filter((item) => item.category === category)
				: mockMenuItems;
			resolve(filteredItems);
		}, 400); // Simulate network delay
	});
}

export async function fetchMenuItemById(id: string): Promise<MenuItem | null> {
	// In production, this would be: const response = await fetch(`${API_BASE_URL}/menu/items/${id}`)
	// For now, return mock item with simulated delay

	return new Promise((resolve) => {
		setTimeout(() => {
			const item = mockMenuItems.find((item) => item.id === id);
			resolve(item || null);
		}, 200); // Simulate network delay
	});
}

export async function searchMenuItems(
	query: string,
	filters?: {
		dietary?: string[];
		spiceLevel?: string[];
		priceRange?: [number, number];
	},
): Promise<MenuItem[]> {
	// In production, this would be a POST request to the API
	// For now, filter mock data

	return new Promise((resolve) => {
		setTimeout(() => {
			let filteredItems = mockMenuItems;

			// Text search
			if (query) {
				const searchTerms = query.toLowerCase().split(" ");
				filteredItems = filteredItems.filter((item) =>
					searchTerms.some(
						(term) =>
							item.name.toLowerCase().includes(term) ||
							item.description.toLowerCase().includes(term),
					),
				);
			}

			// Dietary filters
			if (filters?.dietary?.length) {
				filteredItems = filteredItems.filter((item) => {
					return filters.dietary!.every((diet) => {
						switch (diet) {
							case "vegan":
								return item.dietary.vegan;
							case "vegetarian":
								return item.dietary.vegetarian;
							case "gluten-free":
								return item.dietary.gluten_free;
							case "halal":
								return item.dietary.halal;
							default:
								return true;
						}
					});
				});
			}

			// Spice level filters
			if (filters?.spiceLevel?.length) {
				filteredItems = filteredItems.filter((item) =>
					filters.spiceLevel!.includes(item.spice_level),
				);
			}

			// Price range filter
			if (filters?.priceRange) {
				const [min, max] = filters.priceRange;
				filteredItems = filteredItems.filter(
					(item) => item.price >= min && item.price <= max,
				);
			}

			resolve(filteredItems);
		}, 500); // Simulate search processing time
	});
}
