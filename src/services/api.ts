const API_BASE_URL = 'http://localhost:8089'

export interface Brand {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  parent_id?: string
  created_at: string
  updated_at: string
}

export interface BrandsResponse {
  $schema: string
  brands: Brand[]
}

export interface CategoriesResponse {
  $schema: string
  categories: Category[]
}

export async function fetchBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/brands`)
    if (!response.ok) {
      throw new Error(`Failed to fetch brands: ${response.statusText}`)
    }
    const data: BrandsResponse = await response.json()
    return data.brands
  } catch (error) {
    console.error('Error fetching brands:', error)
    return []
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`)
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`)
    }
    const data: CategoriesResponse = await response.json()
    return data.categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}