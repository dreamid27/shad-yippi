import { useMemo, useState } from "react";
import type { ProductVariant, VariantOption } from "../types";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface VariantSelectorProps {
	variants: ProductVariant[];
	onVariantChange: (variant: ProductVariant | null) => void;
	selectedVariant?: ProductVariant | null;
}

export function VariantSelector({
	variants,
	onVariantChange,
	selectedVariant,
}: VariantSelectorProps) {
	// Extract all unique attribute keys from variants
	const attributeKeys = useMemo(() => {
		const keys = new Set<string>();
		for (const variant of variants) {
			for (const key of Object.keys(variant.attributes)) {
				keys.add(key);
			}
		}
		return Array.from(keys);
	}, [variants]);

	// Track selected values for each attribute
	const [selectedAttributes, setSelectedAttributes] = useState<
		Record<string, string>
	>(() => {
		if (selectedVariant) {
			return selectedVariant.attributes;
		}
		return {};
	});

	// Get available options for a specific attribute based on current selections
	const getAvailableOptions = (
		attributeKey: string,
	): Map<string, VariantOption> => {
		const options = new Map<string, VariantOption>();

		// Filter variants based on other selected attributes (progressive filtering)
		const relevantVariants = variants.filter((variant) => {
			return Object.entries(selectedAttributes).every(([key, value]) => {
				// Skip the current attribute we're checking
				if (key === attributeKey) return true;
				return variant.attributes[key] === value;
			});
		});

		// Collect all unique values for this attribute
		for (const variant of relevantVariants) {
			const value = variant.attributes[attributeKey];
			if (!value) continue;

			// Check if this option is available (in stock and active)
			const isAvailable =
				variant.is_active && variant.is_in_stock && variant.stock_quantity > 0;

			// If we've seen this value before, mark as available if ANY variant is available
			if (options.has(value)) {
				const existing = options.get(value)!;
				options.set(value, {
					value,
					isAvailable: existing.isAvailable || isAvailable,
				});
			} else {
				options.set(value, { value, isAvailable });
			}
		}

		return options;
	};

	// Find matching variant based on selected attributes
	const findMatchingVariant = (
		attrs: Record<string, string>,
	): ProductVariant | null => {
		return (
			variants.find((variant) => {
				return Object.entries(attrs).every(
					([key, value]) => variant.attributes[key] === value,
				);
			}) || null
		);
	};

	// Handle attribute selection
	const handleAttributeChange = (key: string, value: string) => {
		const newAttributes = { ...selectedAttributes, [key]: value };
		setSelectedAttributes(newAttributes);

		// Check if all attributes are selected
		const allSelected = attributeKeys.every((k) => newAttributes[k]);

		if (allSelected) {
			const matchingVariant = findMatchingVariant(newAttributes);
			onVariantChange(matchingVariant);
		} else {
			onVariantChange(null);
		}
	};

	// Determine UI type for attribute (size/color get special treatment)
	const getUIType = (key: string): "size" | "color" | "generic" => {
		const lowerKey = key.toLowerCase();
		if (lowerKey === "size" || lowerKey === "ukuran") return "size";
		if (lowerKey === "color" || lowerKey === "warna") return "color";
		return "generic";
	};

	// Render attribute selector based on type
	const renderAttributeSelector = (attributeKey: string) => {
		const uiType = getUIType(attributeKey);
		const options = getAvailableOptions(attributeKey);
		const selectedValue = selectedAttributes[attributeKey];

		if (options.size === 0) return null;

		// Size selector - button grid
		if (uiType === "size") {
			return (
				<div key={attributeKey} className="space-y-3">
					<label className="text-sm font-medium uppercase tracking-wider">
						{attributeKey}
					</label>
					<div className="flex flex-wrap gap-2">
						{Array.from(options.values()).map((option) => (
							<Button
								key={option.value}
								variant={selectedValue === option.value ? "default" : "outline"}
								onClick={() =>
									handleAttributeChange(attributeKey, option.value)
								}
								disabled={!option.isAvailable}
								className={`
									min-w-[60px] h-12 border transition-all
									${
										selectedValue === option.value
											? "bg-white text-black border-white"
											: "border-white/20 hover:border-white/60"
									}
									${!option.isAvailable ? "opacity-30 cursor-not-allowed line-through" : ""}
								`}
							>
								{option.value}
							</Button>
						))}
					</div>
				</div>
			);
		}

		// Color selector - color swatches with border
		if (uiType === "color") {
			return (
				<div key={attributeKey} className="space-y-3">
					<label className="text-sm font-medium uppercase tracking-wider">
						{attributeKey}
					</label>
					<div className="flex flex-wrap gap-3">
						{Array.from(options.values()).map((option) => {
							const colorValue = option.value.toLowerCase();
							// Map common color names to hex/css colors
							const colorMap: Record<string, string> = {
								red: "#FF0000",
								merah: "#FF0000",
								blue: "#0000FF",
								biru: "#0000FF",
								green: "#00FF00",
								hijau: "#00FF00",
								black: "#000000",
								hitam: "#000000",
								white: "#FFFFFF",
								putih: "#FFFFFF",
								yellow: "#FFFF00",
								kuning: "#FFFF00",
								pink: "#FFC0CB",
								purple: "#800080",
								ungu: "#800080",
								gray: "#808080",
								abu: "#808080",
								brown: "#A52A2A",
								coklat: "#A52A2A",
								orange: "#FFA500",
								oranye: "#FFA500",
								navy: "#000080",
								beige: "#F5F5DC",
								cream: "#FFFDD0",
								krem: "#FFFDD0",
							};

							const bgColor = colorMap[colorValue] || colorValue;

							return (
								<button
									type="button"
									key={option.value}
									onClick={() =>
										handleAttributeChange(attributeKey, option.value)
									}
									disabled={!option.isAvailable}
									className={`
										relative w-12 h-12 rounded-full border-2 transition-all
										${
											selectedValue === option.value
												? "border-white scale-110"
												: "border-white/20 hover:border-white/60"
										}
										${!option.isAvailable ? "opacity-30 cursor-not-allowed" : ""}
									`}
									title={option.value}
								>
									<div
										className="w-full h-full rounded-full"
										style={{ backgroundColor: bgColor }}
									/>
									{!option.isAvailable && (
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="w-full h-[2px] bg-white rotate-45" />
										</div>
									)}
								</button>
							);
						})}
					</div>
					{selectedValue && (
						<p className="text-sm text-gray-400">Selected: {selectedValue}</p>
					)}
				</div>
			);
		}

		// Generic selector - dropdown
		return (
			<div key={attributeKey} className="space-y-3">
				<label className="text-sm font-medium uppercase tracking-wider">
					{attributeKey}
				</label>
				<Select
					value={selectedValue || ""}
					onValueChange={(value) => handleAttributeChange(attributeKey, value)}
				>
					<SelectTrigger className="w-full border-white/20 bg-transparent text-white hover:border-white/60">
						<SelectValue placeholder={`Select ${attributeKey}`} />
					</SelectTrigger>
					<SelectContent>
						{Array.from(options.values()).map((option) => (
							<SelectItem
								key={option.value}
								value={option.value}
								disabled={!option.isAvailable}
								className={!option.isAvailable ? "line-through opacity-50" : ""}
							>
								{option.value}
								{!option.isAvailable && " (Out of stock)"}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		);
	};

	if (attributeKeys.length === 0) {
		return null;
	}

	return (
		<div className="space-y-6">
			{attributeKeys.map((key) => renderAttributeSelector(key))}

			{/* Stock status message */}
			{selectedVariant && (
				<div className="pt-4 border-t border-white/10">
					{selectedVariant.is_in_stock && selectedVariant.stock_quantity > 0 ? (
						<p className="text-sm text-green-400">
							In Stock ({selectedVariant.stock_quantity} available)
						</p>
					) : (
						<p className="text-sm text-red-400">Out of Stock</p>
					)}
				</div>
			)}
		</div>
	);
}
