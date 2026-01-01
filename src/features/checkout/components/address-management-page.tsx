/**
 * AddressManagementPage Component
 * Page for managing user's shipping addresses
 */

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, MapPin, ArrowLeft } from "lucide-react";
import { AddressCard } from "./address-card";
import { AddressForm } from "./address-form";
import type {
	Address,
	CreateAddressRequest,
	UpdateAddressRequest,
} from "../types";

interface AddressManagementPageProps {
	addresses: Address[];
	loading?: boolean;
	onCreateAddress: (data: CreateAddressRequest) => Promise<void>;
	onUpdateAddress: (id: string, data: UpdateAddressRequest) => Promise<void>;
	onDeleteAddress: (id: string) => Promise<void>;
	onSetDefaultAddress: (id: string) => Promise<void>;
}

type ViewMode = "list" | "create" | "edit";

export function AddressManagementPage({
	addresses,
	loading = false,
	onCreateAddress,
	onUpdateAddress,
	onDeleteAddress,
	onSetDefaultAddress,
}: AddressManagementPageProps) {
	const [viewMode, setViewMode] = useState<ViewMode>("list");
	const [editingAddress, setEditingAddress] = useState<Address | undefined>(
		undefined,
	);
	const [submitting, setSubmitting] = useState(false);

	const handleCreateAddress = async (data: CreateAddressRequest) => {
		setSubmitting(true);
		try {
			await onCreateAddress(data);
			setViewMode("list");
		} finally {
			setSubmitting(false);
		}
	};

	const handleUpdateAddress = async (data: UpdateAddressRequest) => {
		if (!editingAddress) return;
		setSubmitting(true);
		try {
			await onUpdateAddress(editingAddress.id, data);
			setViewMode("list");
			setEditingAddress(undefined);
		} finally {
			setSubmitting(false);
		}
	};

	const handleEditAddress = (addressId: string) => {
		const address = addresses.find((a) => a.id === addressId);
		if (address) {
			setEditingAddress(address);
			setViewMode("edit");
		}
	};

	const handleDeleteAddress = async (addressId: string) => {
		if (!confirm("Are you sure you want to delete this address?")) return;
		setSubmitting(true);
		try {
			await onDeleteAddress(addressId);
		} finally {
			setSubmitting(false);
		}
	};

	const handleSetDefault = async (addressId: string) => {
		setSubmitting(true);
		try {
			await onSetDefaultAddress(addressId);
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancel = () => {
		setViewMode("list");
		setEditingAddress(undefined);
	};

	// List View
	if (viewMode === "list") {
		return (
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-black text-gray-900">My Addresses</h1>
						<p className="text-gray-600 mt-1">Manage your shipping addresses</p>
					</div>
					<Link
						to="/checkout"
						className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-all duration-200"
					>
						<ArrowLeft className="w-4 h-4" strokeWidth={2} />
						Back to Checkout
					</Link>
				</div>

				{/* Loading State */}
				{loading && addresses.length === 0 ? (
					<div className="bg-gray-50 rounded-2xl p-12 text-center">
						<div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
						<p className="text-gray-600 font-medium">Loading addresses...</p>
					</div>
				) : addresses.length > 0 ? (
					/* Address List */
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{addresses.map((address) => (
							<AddressCard
								key={address.id}
								address={address}
								isSelected={false}
								onClick={() => handleSetDefault(address.id)}
								onEdit={() => handleEditAddress(address.id)}
								onDelete={() => handleDeleteAddress(address.id)}
								loading={submitting}
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
							No addresses yet
						</h3>
						<p className="text-gray-600 mb-6">
							Add your first shipping address to make checkout faster
						</p>
					</div>
				)}

				{/* Add New Address Button */}
				<button
					onClick={() => setViewMode("create")}
					disabled={submitting}
					className="flex items-center justify-center gap-2 w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
					type="button"
				>
					<Plus
						className="w-5 h-5 group-hover:rotate-90 transition-transform"
						strokeWidth={2}
					/>
					Add New Address
				</button>
			</div>
		);
	}

	// Create/Edit View
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<button
					onClick={handleCancel}
					disabled={submitting}
					className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
					type="button"
				>
					<ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
				</button>
				<div>
					<h1 className="text-3xl font-black text-gray-900">
						{viewMode === "create" ? "Add New Address" : "Edit Address"}
					</h1>
					<p className="text-gray-600 mt-1">
						{viewMode === "create"
							? "Fill in the details below"
							: "Update your address information"}
					</p>
				</div>
			</div>

			{/* Form Card */}
			<div className="bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8">
				<AddressForm
					address={editingAddress}
					onSubmit={
						viewMode === "create" ? handleCreateAddress : handleUpdateAddress
					}
					onCancel={handleCancel}
					loading={submitting}
					submitButtonText={
						viewMode === "create" ? "Add Address" : "Update Address"
					}
				/>
			</div>
		</div>
	);
}
