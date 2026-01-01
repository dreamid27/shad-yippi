/**
 * AddressCard Component
 * Displays a shipping address with edit/delete actions
 */

import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Edit, Trash2, Check } from "lucide-react";
import type { Address } from "../types";

interface AddressCardProps {
	address: Address;
	selected?: boolean;
	onSelect?: (addressId: string) => void;
	onEdit?: (addressId: string) => void;
	onDelete?: (addressId: string) => void;
	disabled?: boolean;
	loading?: boolean;
}

export function AddressCard({
	address,
	selected = false,
	onSelect,
	onEdit,
	onDelete,
	disabled = false,
	loading = false,
}: AddressCardProps) {
	const {
		label,
		recipient_name,
		phone,
		address_line1,
		address_line2,
		city_name,
		district,
		province_name,
		postal_code,
		is_default,
	} = address;

	const handleClick = () => {
		if (!disabled && onSelect) {
			onSelect(address.id);
		}
	};

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onEdit) {
			onEdit(address.id);
		}
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onDelete) {
			onDelete(address.id);
		}
	};

	return (
		<div
			onClick={handleClick}
			className={`
        group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer
        ${
					selected
						? "border-emerald-500 bg-emerald-50/30 shadow-lg shadow-emerald-500/10"
						: "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md"
				}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
		>
			{/* Default Badge */}
			{is_default && (
				<div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
					DEFAULT
				</div>
			)}

			{/* Selected Indicator */}
			{selected && (
				<div className="absolute -top-3 -left-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
					<Check className="w-5 h-5" strokeWidth={3} />
				</div>
			)}

			<div className="space-y-3">
				{/* Label */}
				<div className="flex items-center gap-2">
					<MapPin className="w-4 h-4 text-gray-400" strokeWidth={2} />
					<span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
						{label}
					</span>
				</div>

				{/* Recipient Name */}
				<h3 className="text-base font-bold text-gray-900 leading-tight">
					{recipient_name}
				</h3>

				{/* Phone */}
				<p className="text-sm text-gray-600">{phone}</p>

				{/* Address Lines */}
				<div className="space-y-1">
					<p className="text-sm text-gray-700 leading-relaxed">
						{address_line1}
					</p>
					{address_line2 && (
						<p className="text-sm text-gray-700 leading-relaxed">
							{address_line2}
						</p>
					)}
					<p className="text-sm text-gray-700 leading-relaxed">
						{[district, city_name, province_name].filter(Boolean).join(", ")}
					</p>
					<p className="text-sm text-gray-700 font-medium">{postal_code}</p>
				</div>
			</div>

			{/* Actions */}
			<div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
				{onEdit && (
					<button
						onClick={handleEdit}
						disabled={disabled || loading}
						className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<Edit className="w-4 h-4" strokeWidth={2} />
						Edit
					</button>
				)}

				{onDelete && (
					<button
						onClick={handleDelete}
						disabled={disabled || loading || is_default}
						className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						title={
							is_default ? "Cannot delete default address" : "Delete address"
						}
					>
						<Trash2 className="w-4 h-4" strokeWidth={2} />
						Delete
					</button>
				)}
			</div>

			{/* Loading Overlay */}
			{loading && (
				<div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
					<div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
				</div>
			)}
		</div>
	);
}
