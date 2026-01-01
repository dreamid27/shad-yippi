/**
 * AddressForm Component
 * Form for creating and editing addresses
 */

import { useState } from "react";
import type {
	Address,
	CreateAddressRequest,
	UpdateAddressRequest,
} from "../types";

interface AddressFormProps {
	address?: Address;
	onSubmit: (
		data: CreateAddressRequest | UpdateAddressRequest,
	) => Promise<void>;
	onCancel?: () => void;
	loading?: boolean;
	submitButtonText?: string;
}

// Mock provinces - replace with RajaOngkir API
const PROVINCES = [
	{ id: "1", name: "DKI Jakarta" },
	{ id: "2", name: "Jawa Barat" },
	{ id: "3", name: "Jawa Tengah" },
	{ id: "4", name: "Jawa Timur" },
	{ id: "5", name: "Banten" },
	{ id: "6", name: "DI Yogyakarta" },
];

// Mock cities - replace with RajaOngkir API
const CITIES: Record<string, Array<{ id: string; name: string }>> = {
	"1": [
		{ id: "11", name: "Jakarta Pusat" },
		{ id: "12", name: "Jakarta Utara" },
		{ id: "13", name: "Jakarta Barat" },
		{ id: "14", name: "Jakarta Selatan" },
		{ id: "15", name: "Jakarta Timur" },
	],
	"2": [
		{ id: "21", name: "Bandung" },
		{ id: "22", name: "Bekasi" },
		{ id: "23", name: "Bogor" },
	],
	"3": [
		{ id: "31", name: "Semarang" },
		{ id: "32", name: "Solo" },
	],
	"4": [
		{ id: "41", name: "Surabaya" },
		{ id: "42", name: "Malang" },
	],
	"5": [{ id: "51", name: "Tangerang" }],
	"6": [{ id: "61", name: "Yogyakarta" }],
};

const LABELS = ["Home", "Office", "Apartment", "Other"];

export function AddressForm({
	address,
	onSubmit,
	onCancel,
	loading = false,
	submitButtonText = "Save Address",
}: AddressFormProps) {
	const isEditing = !!address;

	// Form state
	const [label, setLabel] = useState(address?.label || "");
	const [recipientName, setRecipientName] = useState(
		address?.recipient_name || "",
	);
	const [phone, setPhone] = useState(address?.phone || "");
	const [addressLine1, setAddressLine1] = useState(
		address?.address_line1 || "",
	);
	const [addressLine2, setAddressLine2] = useState(
		address?.address_line2 || "",
	);
	const [provinceId, setProvinceId] = useState(address?.province_id || "");
	const [cityId, setCityId] = useState(address?.city_id || "");
	const [district, setDistrict] = useState(address?.district || "");
	const [postalCode, setPostalCode] = useState(address?.postal_code || "");
	const [isDefault, setIsDefault] = useState(address?.is_default || false);

	// Validation errors
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!label.trim()) newErrors.label = "Label is required";
		if (!recipientName.trim())
			newErrors.recipientName = "Recipient name is required";
		if (!phone.trim()) newErrors.phone = "Phone number is required";
		if (!addressLine1.trim()) newErrors.addressLine1 = "Address is required";
		if (!provinceId) newErrors.provinceId = "Province is required";
		if (!cityId) newErrors.cityId = "City is required";
		if (!postalCode.trim()) newErrors.postalCode = "Postal code is required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		const province = PROVINCES.find((p) => p.id === provinceId);
		const city = CITIES[provinceId]?.find((c) => c.id === cityId);

		if (!province || !city) {
			setErrors({ provinceId: "Invalid province or city" });
			return;
		}

		const data: CreateAddressRequest | UpdateAddressRequest = {
			label: label.trim(),
			recipient_name: recipientName.trim(),
			phone: phone.trim(),
			address_line1: addressLine1.trim(),
			address_line2: addressLine2.trim() || undefined,
			province_id: provinceId,
			province_name: province.name,
			city_id: cityId,
			city_name: city.name,
			district: district.trim() || undefined,
			postal_code: postalCode.trim(),
			is_default: isDefault,
		};

		await onSubmit(data);
	};

	const availableCities = provinceId ? CITIES[provinceId] || [] : [];

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Label */}
			<div>
				<label className="block text-sm font-bold text-gray-900 mb-2">
					Address Label *
				</label>
				<div className="flex flex-wrap gap-2">
					{LABELS.map((presetLabel) => (
						<button
							key={presetLabel}
							type="button"
							onClick={() => setLabel(presetLabel)}
							className={`px-4 py-2 rounded-lg border-2 transition-all ${
								label === presetLabel
									? "border-violet-500 bg-violet-50 text-violet-700 font-bold"
									: "border-gray-200 bg-white text-gray-700 hover:border-violet-300"
							}`}
						>
							{presetLabel}
						</button>
					))}
				</div>
				{errors.label && (
					<p className="text-sm text-red-600 mt-1">{errors.label}</p>
				)}
			</div>

			{/* Recipient Name */}
			<div>
				<label className="block text-sm font-bold text-gray-900 mb-2">
					Recipient Name *
				</label>
				<input
					type="text"
					value={recipientName}
					onChange={(e) => setRecipientName(e.target.value)}
					placeholder="Full name"
					className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
					disabled={loading}
				/>
				{errors.recipientName && (
					<p className="text-sm text-red-600 mt-1">{errors.recipientName}</p>
				)}
			</div>

			{/* Phone */}
			<div>
				<label className="block text-sm font-bold text-gray-900 mb-2">
					Phone Number *
				</label>
				<input
					type="tel"
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					placeholder="08xxxxxxxxxx"
					className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
					disabled={loading}
				/>
				{errors.phone && (
					<p className="text-sm text-red-600 mt-1">{errors.phone}</p>
				)}
			</div>

			{/* Address Line 1 */}
			<div>
				<label className="block text-sm font-bold text-gray-900 mb-2">
					Address Line 1 *
				</label>
				<textarea
					value={addressLine1}
					onChange={(e) => setAddressLine1(e.target.value)}
					placeholder="Street address, building, floor, etc."
					rows={2}
					className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all resize-none"
					disabled={loading}
				/>
				{errors.addressLine1 && (
					<p className="text-sm text-red-600 mt-1">{errors.addressLine1}</p>
				)}
			</div>

			{/* Address Line 2 */}
			<div>
				<label className="block text-sm font-bold text-gray-900 mb-2">
					Address Line 2 (Optional)
				</label>
				<input
					type="text"
					value={addressLine2}
					onChange={(e) => setAddressLine2(e.target.value)}
					placeholder="Apartment, suite, unit, building, floor, etc."
					className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
					disabled={loading}
				/>
			</div>

			{/* Province & City */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-bold text-gray-900 mb-2">
						Province *
					</label>
					<select
						value={provinceId}
						onChange={(e) => {
							setProvinceId(e.target.value);
							setCityId(""); // Reset city when province changes
						}}
						className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
						disabled={loading}
					>
						<option value="">Select Province</option>
						{PROVINCES.map((province) => (
							<option key={province.id} value={province.id}>
								{province.name}
							</option>
						))}
					</select>
					{errors.provinceId && (
						<p className="text-sm text-red-600 mt-1">{errors.provinceId}</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-bold text-gray-900 mb-2">
						City *
					</label>
					<select
						value={cityId}
						onChange={(e) => setCityId(e.target.value)}
						disabled={loading || !provinceId}
						className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<option value="">Select City</option>
						{availableCities.map((city) => (
							<option key={city.id} value={city.id}>
								{city.name}
							</option>
						))}
					</select>
					{errors.cityId && (
						<p className="text-sm text-red-600 mt-1">{errors.cityId}</p>
					)}
				</div>
			</div>

			{/* District & Postal Code */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-bold text-gray-900 mb-2">
						District (Optional)
					</label>
					<input
						type="text"
						value={district}
						onChange={(e) => setDistrict(e.target.value)}
						placeholder="Kecamatan"
						className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
						disabled={loading}
					/>
				</div>

				<div>
					<label className="block text-sm font-bold text-gray-900 mb-2">
						Postal Code *
					</label>
					<input
						type="text"
						value={postalCode}
						onChange={(e) => setPostalCode(e.target.value)}
						placeholder="5-digit postal code"
						maxLength={5}
						className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
						disabled={loading}
					/>
					{errors.postalCode && (
						<p className="text-sm text-red-600 mt-1">{errors.postalCode}</p>
					)}
				</div>
			</div>

			{/* Set as Default */}
			<div className="flex items-center gap-3">
				<input
					type="checkbox"
					id="isDefault"
					checked={isDefault}
					onChange={(e) => setIsDefault(e.target.checked)}
					disabled={loading}
					className="w-5 h-5 rounded border-2 border-gray-300 text-violet-600 focus:ring-violet-500 focus:ring-2"
				/>
				<label
					htmlFor="isDefault"
					className="text-sm font-medium text-gray-900"
				>
					Set as default address
				</label>
			</div>

			{/* Actions */}
			<div className="flex gap-3 pt-4">
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						disabled={loading}
						className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-all duration-200 disabled:opacity-50"
					>
						Cancel
					</button>
				)}
				<button
					type="submit"
					disabled={loading}
					className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? (
						<span className="flex items-center justify-center gap-2">
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
							Saving...
						</span>
					) : (
						submitButtonText
					)}
				</button>
			</div>
		</form>
	);
}
