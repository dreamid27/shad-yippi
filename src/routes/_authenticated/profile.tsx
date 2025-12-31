import { createFileRoute } from "@tanstack/react-router"
import { useAuth, useLogout } from "@/features/auth"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute("/_authenticated/profile")({
	component: ProfilePage,
})

function ProfilePage() {
	const { user } = useAuth()
	const logout = useLogout()

	return (
		<div className="container mx-auto p-8">
			<Card className="max-w-md">
				<CardHeader>
					<CardTitle>Profile</CardTitle>
					<CardDescription>Your account information</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<p className="text-sm font-medium text-gray-500">Name</p>
						<p className="text-lg">{user?.name}</p>
					</div>
					<div>
						<p className="text-sm font-medium text-gray-500">Email</p>
						<p className="text-lg">{user?.email}</p>
					</div>
					<div>
						<p className="text-sm font-medium text-gray-500">Role</p>
						<p className="text-lg capitalize">{user?.role}</p>
					</div>
					{user?.phone && (
						<div>
							<p className="text-sm font-medium text-gray-500">Phone</p>
							<p className="text-lg">{user.phone}</p>
						</div>
					)}
					<Button
						variant="destructive"
						className="w-full"
						onClick={() => logout.mutate()}
					>
						Logout
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
