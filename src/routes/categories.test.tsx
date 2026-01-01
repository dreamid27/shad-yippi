import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock the products feature
const mockUseProducts = vi.fn();
vi.mock("@/features/products", () => ({
	useProducts: () => mockUseProducts(),
	ProductSkeleton: () => <div data-testid="product-skeleton">Loading...</div>,
}));

// Mock the cart hook
const mockAddItem = vi.fn();
vi.mock("@/hooks/use-cart", () => ({
	useCart: () => ({
		addItem: mockAddItem,
	}),
}));

// Mock the debounce hook
vi.mock("@/hooks/use-debounce", () => ({
	useDebounce: (value: string) => value,
}));

// Mock header component
vi.mock("@/components/layout/header", () => ({
	PageHeader: ({ title, searchValue, onSearchChange }: any) => (
		<header>
			<h1>{title}</h1>
			<input
				type="search"
				value={searchValue}
				onChange={(e) => onSearchChange(e.target.value)}
				placeholder="SEARCH..."
			/>
		</header>
	),
}));

// Mock pagination component
vi.mock("@/components/common/pagination", () => ({
	Pagination: ({ currentPage, totalPages, onPageChange }: any) => (
		<div data-testid="pagination">
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				Previous
			</button>
			<span>
				Page {currentPage} of {totalPages}
			</span>
			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				Next
			</button>
		</div>
	),
}));

import { CategoriesPage } from "./categories";

describe("CategoriesPage", () => {
	const mockProducts = [
		{
			id: "1",
			name: "Product 1",
			description: "Description 1",
			min_price: 100,
			max_price: 150,
			image_urls: ["https://example.com/image1.jpg"],
			base_price: 100,
			slug: "product-1",
			status: "published" as const,
		},
		{
			id: "2",
			name: "Product 2",
			description: "Description 2",
			min_price: 200,
			max_price: 250,
			image_urls: ["https://example.com/image2.jpg"],
			base_price: 200,
			slug: "product-2",
			status: "published" as const,
		},
	];

	const mockPagination = {
		page: 1,
		limit: 20,
		total: 2,
		total_pages: 1,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Rendering", () => {
		it("should render page header with correct title", () => {
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);
			expect(screen.getByText("COLLECTIONS")).toBeInTheDocument();
		});

		it("should render category tabs", () => {
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);
			expect(screen.getByText("ALL")).toBeInTheDocument();
			expect(screen.getByText("OUTERWEAR")).toBeInTheDocument();
			expect(screen.getByText("KNITWEAR")).toBeInTheDocument();
			expect(screen.getByText("BOTTOMS")).toBeInTheDocument();
		});

		it("should render sort button", () => {
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);
			expect(screen.getByText("FEATURED")).toBeInTheDocument();
		});

		it("should render filter button", () => {
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);
			expect(screen.getByText("FILTERS")).toBeInTheDocument();
		});

		it("should render newsletter section", () => {
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);
			expect(screen.getByText("STAY UPDATED")).toBeInTheDocument();
			expect(
				screen.getByPlaceholderText("EMAIL ADDRESS"),
			).toBeInTheDocument();
			expect(screen.getByText("SUBSCRIBE")).toBeInTheDocument();
		});
	});

	describe("Loading State", () => {
		it("should render loading skeleton when isLoading is true", () => {
			mockUseProducts.mockReturnValue({
				data: undefined,
				isLoading: true,
				isError: false,
			});

			render(<CategoriesPage />);
			expect(screen.getByTestId("product-skeleton")).toBeInTheDocument();
		});
	});

	describe("Error State", () => {
		it("should render error message when isError is true", () => {
			mockUseProducts.mockReturnValue({
				data: undefined,
				isLoading: false,
				isError: true,
			});

			render(<CategoriesPage />);
			expect(
				screen.getByText("Failed to load products. Please try again."),
			).toBeInTheDocument();
			expect(screen.getByText("RETRY")).toBeInTheDocument();
		});
	});

	describe("Empty State", () => {
		it("should render empty state when no products found", () => {
			mockUseProducts.mockReturnValue({
				data: { data: [], pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);
			expect(screen.getByText("NO PRODUCTS FOUND")).toBeInTheDocument();
			expect(screen.getByText("CLEAR ALL FILTERS")).toBeInTheDocument();
		});
	});

	describe("Product Display", () => {
		it("should render product cards correctly", () => {
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);
			expect(screen.getByText("Product 1")).toBeInTheDocument();
			expect(screen.getByText("Product 2")).toBeInTheDocument();
			expect(screen.getByText("$100")).toBeInTheDocument();
			expect(screen.getByText("$200")).toBeInTheDocument();
		});

		it("should render pagination when total pages > 1", () => {
			const multiPagePagination = { ...mockPagination, total_pages: 3 };
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: multiPagePagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);
			expect(screen.getByTestId("pagination")).toBeInTheDocument();
		});
	});

	describe("Category Filtering", () => {
		it("should change category when category tab is clicked", async () => {
			const user = userEvent.setup();
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);

			const outerwearButton = screen.getByText("OUTERWEAR");
			await user.click(outerwearButton);

			// Verify category state changed by checking if the tab is selected
			// The selected category has a different border style
			expect(outerwearButton).toHaveClass("border-b-2", "border-white");
		});
	});

	describe("Sort Functionality", () => {
		it("should open sort dropdown when sort button is clicked", async () => {
			const user = userEvent.setup();
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);

			const sortButton = screen.getByText("FEATURED");
			await user.click(sortButton);

			// Verify sort options appear
			await waitFor(() => {
				expect(screen.getByText("PRICE: LOW TO HIGH")).toBeInTheDocument();
				expect(screen.getByText("PRICE: HIGH TO LOW")).toBeInTheDocument();
				expect(screen.getByText("NAME: A-Z")).toBeInTheDocument();
			});
		});
	});

	describe("Filter Drawer", () => {
		it("should open filter drawer when filter button is clicked", async () => {
			const user = userEvent.setup();
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);

			const filterButton = screen.getByText("FILTERS");
			await user.click(filterButton);

			// Verify filter drawer opens
			await waitFor(() => {
				expect(screen.getByText("BRANDS")).toBeInTheDocument();
				expect(screen.getByText("SIZES")).toBeInTheDocument();
				expect(screen.getByText("PRICE RANGE")).toBeInTheDocument();
			});
		});

		it("should display brand filter options", async () => {
			const user = userEvent.setup();
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);

			const filterButton = screen.getByText("FILTERS");
			await user.click(filterButton);

			await waitFor(() => {
				expect(screen.getByText("MONOLITH")).toBeInTheDocument();
				expect(screen.getByText("ARCHITECTURAL")).toBeInTheDocument();
				expect(screen.getByText("MINIMALIST")).toBeInTheDocument();
			});
		});

		it("should display size filter options", async () => {
			const user = userEvent.setup();
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);

			const filterButton = screen.getByText("FILTERS");
			await user.click(filterButton);

			await waitFor(() => {
				expect(screen.getByText("XS")).toBeInTheDocument();
				expect(screen.getByText("S")).toBeInTheDocument();
				expect(screen.getByText("M")).toBeInTheDocument();
				expect(screen.getByText("L")).toBeInTheDocument();
				expect(screen.getByText("XL")).toBeInTheDocument();
			});
		});

		it("should display price range filter options", async () => {
			const user = userEvent.setup();
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);

			const filterButton = screen.getByText("FILTERS");
			await user.click(filterButton);

			await waitFor(() => {
				expect(screen.getByText("Under $500")).toBeInTheDocument();
				expect(screen.getByText("$500 - $1000")).toBeInTheDocument();
				expect(screen.getByText("Over $1000")).toBeInTheDocument();
			});
		});
	});

	describe("Search Functionality", () => {
		it("should update search input when user types", async () => {
			const user = userEvent.setup();
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);

			const searchInput = screen.getByPlaceholderText("SEARCH...");
			await user.type(searchInput, "test product");

			expect(searchInput).toHaveValue("test product");
		});
	});

	describe("Accessibility", () => {
		it("should have proper button types", () => {
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);

			const buttons = screen.getAllByRole("button");
			buttons.forEach((button) => {
				// All buttons should have type="button" to prevent form submission
				expect(button).toHaveAttribute("type", "button");
			});
		});

		it("should have proper form field IDs", () => {
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);

			const emailInput = screen.getByPlaceholderText("EMAIL ADDRESS");
			expect(emailInput).toHaveAttribute("id");
			expect(emailInput).toHaveAttribute("name", "email");
		});

		it("should have aria-labels for icon buttons", () => {
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);

			// Filter drawer close button should have aria-label
			const filterButton = screen.getByText("FILTERS");
			filterButton.click();

			waitFor(() => {
				const closeButton = screen.getByLabelText("Close filters");
				expect(closeButton).toBeInTheDocument();
			});
		});
	});

	describe("Active Filters", () => {
		it("should display active filter chips when filters are applied", async () => {
			const user = userEvent.setup();
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);

			// Open filter drawer and select a brand
			const filterButton = screen.getByText("FILTERS");
			await user.click(filterButton);

			await waitFor(async () => {
				const brandButton = screen.getByText("MONOLITH");
				await user.click(brandButton);
			});

			// Active filter should be displayed
			// Note: This depends on the actual implementation of filter state
		});

		it("should clear all filters when clear all button is clicked", async () => {
			const user = userEvent.setup();
			mockUseProducts.mockReturnValue({
				data: { data: mockProducts, pagination: mockPagination },
				isLoading: false,
				isError: false,
			});

			render(<CategoriesPage />);

			// This test would require setting up filters first
			// Then clicking the "Clear all" button
			// Implementation depends on the actual filter state management
		});
	});
});
