# Phase 1 Frontend Authentication Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement frontend authentication system with login, registration, token management, and protected routes for shad-yippi (TanStack Start + Zustand).

**Architecture:** Feature-based architecture with auth feature module containing Zustand store for auth state, TanStack Query for API calls, protected route wrapper, and auth UI components. Tokens stored in localStorage with automatic refresh.

**Tech Stack:** React 19, TanStack Start, TanStack Router, TanStack Query, Zustand, Tailwind CSS, Shadcn UI, TypeScript

**Frontend Directory:** `/Volumes/External/Work/personal/shad-yippi`
**Backend API:** `http://localhost:8089`

---

## Progress

**Completed:**
- [ ] None yet

**Remaining:**
- [ ] Task 1: Create auth feature structure
- [ ] Task 2: Create auth types
- [ ] Task 3: Create auth API client
- [ ] Task 4: Create auth Zustand store
- [ ] Task 5: Create auth API hooks (TanStack Query)
- [ ] Task 6: Create login/register forms
- [ ] Task 7: Create protected route component
- [ ] Task 8: Create auth layout and pages
- [ ] Task 9: Wire auth into router
- [ ] Task 10: Test authentication flow

---

## Task 1: Create Auth Feature Structure

**Files:**
- Create: `src/features/auth/` directory structure

**Step 1: Create feature directories**

Run:
```bash
cd /Volumes/External/Work/personal/shad-yippi
mkdir -p src/features/auth/{components,hooks,api,store,types}
touch src/features/auth/index.ts
touch src/features/auth/types.ts
```

**Step 2: Verify structure**

Run: `ls -R src/features/auth/`
Expected: components/, hooks/, api/, store/, types/, index.ts, types.ts

---

## Task 2: Create Auth Types

**Files:**
- Create: `src/features/auth/types.ts`

**Step 1: Write auth type definitions**

File: `src/features/auth/types.ts`
```typescript
// User entity
export interface User {
	id: number
	email: string
	name: string
	phone?: string
	role: "customer" | "admin"
	is_active: boolean
}

// Auth tokens
export interface AuthTokens {
	access_token: string
	refresh_token: string
	expires_in: number
}

// API request types
export interface RegisterRequest {
	email: string
	password: string
	name: string
	phone?: string
}

export interface LoginRequest {
	email: string
	password: string
}

export interface RefreshTokenRequest {
	refresh_token: string
}

// API response types
export interface AuthResponse {
	user: {
		id: number
		email: string
		name: string
		phone: string
		role: string
		is_active: boolean
	}
	access_token: string
	refresh_token: string
	expires_in: number
}

// Auth state
export interface AuthState {
	user: User | null
	accessToken: string | null
	refreshToken: string | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
}
```

**Step 2: Commit**

```bash
git add src/features/auth/types.ts
git commit -m "feat(auth): add auth type definitions"
```

---

## Task 3: Create Auth API Client

**Files:**
- Create: `src/features/auth/api/client.ts`
- Create: `src/features/auth/api/endpoints.ts`

**Step 1: Create API endpoints constants**

File: `src/features/auth/api/endpoints.ts`
```typescript
const API_BASE_URL = "http://localhost:8089"

export const authEndpoints = {
	register: `${API_BASE_URL}/auth/register`,
	login: `${API_BASE_URL}/auth/login`,
	refresh: `${API_BASE_URL}/auth/refresh`,
	logout: `${API_BASE_URL}/auth/logout`,
	me: `${API_BASE_URL}/auth/me`,
} as const
```

**Step 2: Create API client functions**

File: `src/features/auth/api/client.ts`
```typescript
import type {
	AuthResponse,
	LoginRequest,
	RefreshTokenRequest,
	RegisterRequest,
	User,
} from "../types"
import { authEndpoints } from "./endpoints"

// Register new user
export async function registerUser(
	data: RegisterRequest,
): Promise<AuthResponse> {
	const response = await fetch(authEndpoints.register, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || "Registration failed")
	}

	return response.json()
}

// Login user
export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
	const response = await fetch(authEndpoints.login, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || "Login failed")
	}

	return response.json()
}

// Refresh access token
export async function refreshAccessToken(
	refreshToken: string,
): Promise<AuthResponse> {
	const response = await fetch(authEndpoints.refresh, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ refresh_token: refreshToken }),
	})

	if (!response.ok) {
		throw new Error("Token refresh failed")
	}

	return response.json()
}

// Logout user
export async function logoutUser(refreshToken: string): Promise<void> {
	await fetch(authEndpoints.logout, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ refresh_token: refreshToken }),
	})
}

// Get current user
export async function getCurrentUser(accessToken: string): Promise<User> {
	const response = await fetch(authEndpoints.me, {
		headers: { Authorization: `Bearer ${accessToken}` },
	})

	if (!response.ok) {
		throw new Error("Failed to fetch user")
	}

	const data = await response.json()
	return data.user
}
```

**Step 3: Commit**

```bash
git add src/features/auth/api/
git commit -m "feat(auth): add auth API client functions"
```

---

## Task 4: Create Auth Zustand Store

**Files:**
- Create: `src/features/auth/store/auth-store.ts`

**Step 1: Write auth store with persistence**

File: `src/features/auth/store/auth-store.ts`
```typescript
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { AuthState, User } from "../types"

interface AuthActions {
	setAuth: (user: User, accessToken: string, refreshToken: string) => void
	clearAuth: () => void
	setUser: (user: User) => void
	setAccessToken: (token: string) => void
	setError: (error: string | null) => void
	setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
	user: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
}

export const useAuthStore = create<AuthStore>()(
	devtools(
		persist(
			(set) => ({
				...initialState,

				setAuth: (user, accessToken, refreshToken) =>
					set({
						user,
						accessToken,
						refreshToken,
						isAuthenticated: true,
						error: null,
					}),

				clearAuth: () =>
					set({
						...initialState,
					}),

				setUser: (user) => set({ user }),

				setAccessToken: (token) => set({ accessToken: token }),

				setError: (error) => set({ error, isLoading: false }),

				setLoading: (loading) => set({ isLoading: loading }),
			}),
			{
				name: "auth-storage",
				partialize: (state) => ({
					user: state.user,
					accessToken: state.accessToken,
					refreshToken: state.refreshToken,
					isAuthenticated: state.isAuthenticated,
				}),
			},
		),
		{ name: "AuthStore" },
	),
)
```

**Step 2: Commit**

```bash
git add src/features/auth/store/
git commit -m "feat(auth): add Zustand auth store with persistence"
```

---

## Task 5: Create Auth API Hooks (TanStack Query)

**Files:**
- Create: `src/features/auth/hooks/use-auth.ts`
- Create: `src/features/auth/hooks/use-login.ts`
- Create: `src/features/auth/hooks/use-register.ts`
- Create: `src/features/auth/hooks/use-logout.ts`

**Step 1: Create login mutation hook**

File: `src/features/auth/hooks/use-login.ts`
```typescript
import { useMutation } from "@tanstack/react-query"
import { loginUser } from "../api/client"
import { useAuthStore } from "../store/auth-store"
import type { LoginRequest } from "../types"

export function useLogin() {
	const setAuth = useAuthStore((state) => state.setAuth)
	const setError = useAuthStore((state) => state.setError)
	const setLoading = useAuthStore((state) => state.setLoading)

	return useMutation({
		mutationFn: (data: LoginRequest) => loginUser(data),
		onMutate: () => {
			setLoading(true)
			setError(null)
		},
		onSuccess: (response) => {
			const user = {
				id: response.user.id,
				email: response.user.email,
				name: response.user.name,
				phone: response.user.phone,
				role: response.user.role as "customer" | "admin",
				is_active: response.user.is_active,
			}
			setAuth(user, response.access_token, response.refresh_token)
			setLoading(false)
		},
		onError: (error: Error) => {
			setError(error.message)
			setLoading(false)
		},
	})
}
```

**Step 2: Create register mutation hook**

File: `src/features/auth/hooks/use-register.ts`
```typescript
import { useMutation } from "@tanstack/react-query"
import { registerUser } from "../api/client"
import { useAuthStore } from "../store/auth-store"
import type { RegisterRequest } from "../types"

export function useRegister() {
	const setAuth = useAuthStore((state) => state.setAuth)
	const setError = useAuthStore((state) => state.setError)
	const setLoading = useAuthStore((state) => state.setLoading)

	return useMutation({
		mutationFn: (data: RegisterRequest) => registerUser(data),
		onMutate: () => {
			setLoading(true)
			setError(null)
		},
		onSuccess: (response) => {
			const user = {
				id: response.user.id,
				email: response.user.email,
				name: response.user.name,
				phone: response.user.phone,
				role: response.user.role as "customer" | "admin",
				is_active: response.user.is_active,
			}
			setAuth(user, response.access_token, response.refresh_token)
			setLoading(false)
		},
		onError: (error: Error) => {
			setError(error.message)
			setLoading(false)
		},
	})
}
```

**Step 3: Create logout mutation hook**

File: `src/features/auth/hooks/use-logout.ts`
```typescript
import { useMutation } from "@tanstack/react-query"
import { logoutUser } from "../api/client"
import { useAuthStore } from "../store/auth-store"

export function useLogout() {
	const refreshToken = useAuthStore((state) => state.refreshToken)
	const clearAuth = useAuthStore((state) => state.clearAuth)

	return useMutation({
		mutationFn: () => {
			if (!refreshToken) throw new Error("No refresh token")
			return logoutUser(refreshToken)
		},
		onSuccess: () => {
			clearAuth()
		},
		onError: () => {
			// Always clear auth even if logout fails
			clearAuth()
		},
	})
}
```

**Step 4: Create main auth hook**

File: `src/features/auth/hooks/use-auth.ts`
```typescript
import { useAuthStore } from "../store/auth-store"

export function useAuth() {
	const user = useAuthStore((state) => state.user)
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
	const isLoading = useAuthStore((state) => state.isLoading)
	const error = useAuthStore((state) => state.error)

	return {
		user,
		isAuthenticated,
		isLoading,
		error,
		isAdmin: user?.role === "admin",
		isCustomer: user?.role === "customer",
	}
}
```

**Step 5: Commit**

```bash
git add src/features/auth/hooks/
git commit -m "feat(auth): add TanStack Query auth hooks"
```

---

## Task 6: Create Login/Register Forms

**Files:**
- Create: `src/features/auth/components/login-form.tsx`
- Create: `src/features/auth/components/register-form.tsx`

**Step 1: Install Shadcn form components**

Run:
```bash
cd /Volumes/External/Work/personal/shad-yippi
pnpm dlx shadcn@latest add form input button label card
```

**Step 2: Create login form component**

File: `src/features/auth/components/login-form.tsx`
```typescript
import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { useLogin } from "../hooks/use-login"

export function LoginForm() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const navigate = useNavigate()
	const login = useLogin()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		login.mutate(
			{ email, password },
			{
				onSuccess: () => {
					navigate({ to: "/" })
				},
			},
		)
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Login</CardTitle>
				<CardDescription>
					Enter your email and password to access your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					{login.isError && (
						<p className="text-sm text-red-500">{login.error?.message}</p>
					)}
					<Button type="submit" className="w-full" disabled={login.isPending}>
						{login.isPending ? "Logging in..." : "Login"}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
```

**Step 3: Create register form component**

File: `src/features/auth/components/register-form.tsx`
```typescript
import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { useRegister } from "../hooks/use-register"

export function RegisterForm() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		name: "",
		phone: "",
	})
	const navigate = useNavigate()
	const register = useRegister()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		register.mutate(formData, {
			onSuccess: () => {
				navigate({ to: "/" })
			},
		})
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Create Account</CardTitle>
				<CardDescription>
					Enter your information to create a new account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Full Name</Label>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="John Doe"
							value={formData.name}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone">Phone (optional)</Label>
						<Input
							id="phone"
							name="phone"
							type="tel"
							placeholder="+62812345678"
							value={formData.phone}
							onChange={handleChange}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="••••••••"
							value={formData.password}
							onChange={handleChange}
							required
							minLength={6}
						/>
					</div>
					{register.isError && (
						<p className="text-sm text-red-500">{register.error?.message}</p>
					)}
					<Button
						type="submit"
						className="w-full"
						disabled={register.isPending}
					>
						{register.isPending ? "Creating account..." : "Create Account"}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
```

**Step 4: Commit**

```bash
git add src/features/auth/components/
git commit -m "feat(auth): add login and register form components"
```

---

## Task 7: Create Protected Route Component

**Files:**
- Create: `src/features/auth/components/protected-route.tsx`

**Step 1: Write protected route wrapper**

File: `src/features/auth/components/protected-route.tsx`
```typescript
import { useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useAuth } from "../hooks/use-auth"

interface ProtectedRouteProps {
	children: React.ReactNode
	requireAdmin?: boolean
}

export function ProtectedRoute({
	children,
	requireAdmin = false,
}: ProtectedRouteProps) {
	const { isAuthenticated, isAdmin, isLoading } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			navigate({ to: "/login" })
		}

		if (!isLoading && requireAdmin && !isAdmin) {
			navigate({ to: "/" })
		}
	}, [isAuthenticated, isAdmin, isLoading, requireAdmin, navigate])

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p>Loading...</p>
			</div>
		)
	}

	if (!isAuthenticated) {
		return null
	}

	if (requireAdmin && !isAdmin) {
		return null
	}

	return <>{children}</>
}
```

**Step 2: Commit**

```bash
git add src/features/auth/components/protected-route.tsx
git commit -m "feat(auth): add protected route component"
```

---

## Task 8: Create Auth Layout and Pages

**Files:**
- Create: `src/routes/login.tsx`
- Create: `src/routes/register.tsx`
- Modify: `src/features/auth/index.ts`

**Step 1: Export auth components from barrel**

File: `src/features/auth/index.ts`
```typescript
// Components
export { LoginForm } from "./components/login-form"
export { RegisterForm } from "./components/register-form"
export { ProtectedRoute } from "./components/protected-route"

// Hooks
export { useAuth } from "./hooks/use-auth"
export { useLogin } from "./hooks/use-login"
export { useRegister } from "./hooks/use-register"
export { useLogout } from "./hooks/use-logout"

// Store
export { useAuthStore } from "./store/auth-store"

// Types
export type { User, AuthTokens, AuthState } from "./types"
```

**Step 2: Create login page route**

File: `src/routes/login.tsx`
```typescript
import { createFileRoute } from "@tanstack/react-router"
import { LoginForm } from "@/features/auth"

export const Route = createFileRoute("/login")({
	component: LoginPage,
})

function LoginPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
			<LoginForm />
		</div>
	)
}
```

**Step 3: Create register page route**

File: `src/routes/register.tsx`
```typescript
import { createFileRoute } from "@tanstack/react-router"
import { RegisterForm } from "@/features/auth"

export const Route = createFileRoute("/register")({
	component: RegisterPage,
})

function RegisterPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
			<RegisterForm />
		</div>
	)
}
```

**Step 4: Commit**

```bash
git add src/features/auth/index.ts src/routes/login.tsx src/routes/register.tsx
git commit -m "feat(auth): add login and register routes"
```

---

## Task 9: Wire Auth Into Router

**Files:**
- Modify: `src/routes/__root.tsx` (if exists, otherwise skip)
- Create: `src/routes/_authenticated.tsx` (layout for protected routes)

**Step 1: Create authenticated layout route**

File: `src/routes/_authenticated.tsx`
```typescript
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { ProtectedRoute } from "@/features/auth"

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
	return (
		<ProtectedRoute>
			<Outlet />
		</ProtectedRoute>
	)
}
```

**Step 2: Create example protected route (profile)**

File: `src/routes/_authenticated/profile.tsx`
```typescript
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
```

**Step 3: Regenerate route tree**

Run:
```bash
cd /Volumes/External/Work/personal/shad-yippi
bun run dev
# Wait a few seconds for route tree to regenerate, then stop with Ctrl+C
```

**Step 4: Commit**

```bash
git add src/routes/_authenticated.tsx src/routes/_authenticated/
git commit -m "feat(auth): add authenticated layout and profile page"
```

---

## Task 10: Test Authentication Flow

**Manual Testing Steps:**

**Step 1: Start backend server**

Terminal 1:
```bash
cd /Volumes/External/Work/personal/go-yippi
go run ./cmd/api
```

**Step 2: Start frontend dev server**

Terminal 2:
```bash
cd /Volumes/External/Work/personal/shad-yippi
bun --bun run dev
```

**Step 3: Test registration**

1. Navigate to `http://localhost:3000/register`
2. Fill in registration form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Phone: "+628123456789"
   - Password: "password123"
3. Click "Create Account"
4. Expected: Redirect to homepage, user logged in

**Step 4: Test logout**

1. Navigate to `http://localhost:3000/profile`
2. Click "Logout" button
3. Expected: Redirect to login page, localStorage cleared

**Step 5: Test login**

1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - Email: "test@example.com"
   - Password: "password123"
3. Click "Login"
4. Expected: Redirect to homepage, user logged in

**Step 6: Test protected routes**

1. Logout if logged in
2. Try to access `http://localhost:3000/profile`
3. Expected: Redirect to `/login`
4. Login
5. Try to access `http://localhost:3000/profile` again
6. Expected: Profile page displays user info

**Step 7: Verify localStorage persistence**

1. Login
2. Refresh page
3. Expected: User remains logged in (data loaded from localStorage)

**Step 8: Final commit**

```bash
git add .
git commit -m "test(auth): verify authentication flow works end-to-end"
```

---

## Additional Notes

### Token Refresh Strategy (Future Enhancement)

For production, implement automatic token refresh:

1. Create `src/features/auth/hooks/use-token-refresh.ts`
2. Use interval to check token expiry (before 15 min)
3. Automatically call refresh endpoint
4. Update access token in store

### Error Handling

- Network errors: Show user-friendly messages
- 401 errors: Auto-logout and redirect to login
- 409 errors: Show "Email already exists" message

### Security Considerations

- Tokens stored in localStorage (consider httpOnly cookies for production)
- No sensitive data in localStorage
- Clear tokens on logout
- Implement CSRF protection if using cookies

### Testing Recommendations

- Unit tests for auth hooks
- Unit tests for auth store
- Integration tests for login/register flows
- E2E tests for protected routes
