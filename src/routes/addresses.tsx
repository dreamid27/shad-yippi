/**
 * Addresses Management Route
 * Page for managing user's shipping addresses
 */

import { createFileRoute } from '@tanstack/react-router'
import { AddressManagementPage } from '@/features/checkout'
import type { Address, CreateAddressRequest, UpdateAddressRequest } from '@/features/checkout'

// Mock data - replace with real API calls
const mockAddresses: Address[] = [
	{
		id: '1',
		user_id: 'user-1',
		label: 'Home',
		recipient_name: 'John Doe',
		phone: '08123456789',
		address_line1: 'Jl. Sudirman No. 123',
		address_line2: 'Apt 45',
		province_id: '1',
		province_name: 'DKI Jakarta',
		city_id: '14',
		city_name: 'Jakarta Selatan',
		district: 'Senayan',
		postal_code: '12190',
		is_default: true,
		is_deleted: false,
		created_at: '2025-01-01T00:00:00Z',
		updated_at: '2025-01-01T00:00:00Z',
	},
	{
		id: '2',
		user_id: 'user-1',
		label: 'Office',
		recipient_name: 'John Doe',
		phone: '08123456789',
		address_line1: 'SCBD Lot 28',
		address_line2: undefined,
		province_id: '1',
		province_name: 'DKI Jakarta',
		city_id: '14',
		city_name: 'Jakarta Selatan',
		district: 'Senopati',
		postal_code: '12190',
		is_default: false,
		is_deleted: false,
		created_at: '2025-01-01T00:00:00Z',
		updated_at: '2025-01-01T00:00:00Z',
	},
]

export const Route = createFileRoute('/addresses')({
	component: AddressesPage,
})

function AddressesPage() {
	const handleCreateAddress = async (data: CreateAddressRequest) => {
		console.log('Create address:', data)
		// TODO: Call API to create address
		// await addressApi.create(data)
	}

	const handleUpdateAddress = async (id: string, data: UpdateAddressRequest) => {
		console.log('Update address:', id, data)
		// TODO: Call API to update address
		// await addressApi.update(id, data)
	}

	const handleDeleteAddress = async (id: string) => {
		console.log('Delete address:', id)
		// TODO: Call API to delete address
		// await addressApi.delete(id)
	}

	const handleSetDefaultAddress = async (id: string) => {
		console.log('Set default address:', id)
		// TODO: Call API to set default
		// await addressApi.setDefault(id)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<AddressManagementPage
				addresses={mockAddresses}
				loading={false}
				onCreateAddress={handleCreateAddress}
				onUpdateAddress={handleUpdateAddress}
				onDeleteAddress={handleDeleteAddress}
				onSetDefaultAddress={handleSetDefaultAddress}
			/>
		</div>
	)
}
