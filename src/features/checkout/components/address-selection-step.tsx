/**
 * AddressSelectionStep Component
 * Step 1: Select or add shipping address
 */

import { Link } from "@tanstack/react-router";
import { Plus, MapPin } from "lucide-react";
import { AddressCard } from "./address-card";
import type { Address } from "../types";

interface AddressSelectionStepProps {
	addresses: Address[];
	selectedAddressId?: string;
	onAddressSelect: (addressId: string) => void;
	onEditAddress: (addressId: string) => void;
	onDeleteAddress: (addressId: string) => void;
	loading?: boolean;
	valid?: boolean;
	onValidationChange?: (valid: boolean) => void;
}

export function AddressSelectionStep({
	addresses,
	selectedAddressId,
	onAddressSelect,
	onEditAddress,
	onDeleteAddress,
	loading = false,
	valid = false,
	onValidationChange,
}: AddressSelectionStepProps) {
	// Notify parent of validation state
	if (onValidationChange) {
		onValidationChange(!!selectedAddressId);
	}

	const defaultAddress = addresses.find((a) => a.is_default);
	const selectedAddress =
		addresses.find((a) => a.id === selectedAddressId) || defaultAddress;

	return (
		<div className="space-y-6">
			{/* Step Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-black text-gray-900">Shipping Address</h2>
				<p className="text-gray-600">
					Select where you want your order delivered
				</p>
			</div>

			{/* Address List */}
			{addresses.length > 0 ? (
				<div className="space-y-4">
					{addresses.map((address) => (
						<AddressCard
							key={address.id}
							address={address}
							isSelected={selectedAddress?.id === address.id}
							onClick={() => onAddressSelect(address.id)}
							onEdit={() => onEditAddress(address.id)}
							onDelete={() => onDeleteAddress(address.id)}
							loading={loading}
						/>
					))}
				</div>
			) : (
				/* Empty State */
				<div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
					<div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
						<MapPin className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
					</div>
					<h3 className="text-lg font-bold text-gray-900 mb-2">
						No shipping addresses
					</h3>
					<p className="text-gray-600 mb-6">
						Add a shipping address to continue with checkout
					</p>
				</div>
			)}

			{/* Add New Address Button */}
			<Link
				to="/addresses"
				className="flex items-center justify-center gap-2 w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all duration-200 group"
			>
				<Plus
					className="w-5 h-5 group-hover:rotate-90 transition-transform"
					strokeWidth={2}
				/>
				Add New Address
			</Link>

			{/* Validation Message */}
			{!valid && !selectedAddressId && (
				<p className="text-sm font-semibold text-red-600 text-center">
					Please select a shipping address to continue
				</p>
			)}
		</div>
	);
}
