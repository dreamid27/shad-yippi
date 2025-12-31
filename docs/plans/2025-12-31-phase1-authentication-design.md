# Phase 1: Authentication & Foundation - Implementation Design

**Date:** 2025-12-31
**Duration:** Week 1-2 (2 weeks)
**Projects:** shad-yippi (Frontend) + go-yippi (Backend)

---

## Overview

Phase 1 focuses on building the authentication foundation and refactoring the frontend to feature-based architecture. This phase establishes the security infrastructure needed for the entire e-commerce application.

**Key Deliverables:**
- JWT-based authentication system (Access + Refresh tokens)
- User registration and login
- Role-based authorization (customer, admin)
- Frontend refactored to feature-based architecture
- Protected routes and auto token refresh

---

## Technology Decisions

### Backend
- **JWT Library:** golang-jwt/jwt v5 (most popular, simple API, Fiber integration)
- **Password Hashing:** bcrypt with cost factor 10 (industry standard)
- **Token Strategy:** Access (15 min) + Refresh (30 days) tokens, database-stored
- **Roles:** Simple 2-role system - `customer` and `admin`

### Frontend
- **State Management:** Zustand store + localStorage for auth state
- **API Client:** Axios with auto-refresh interceptors
- **Protected Routes:** HOC wrapper for route protection
- **Architecture:** Feature-based (following CLAUDE.md guidelines)

---

## Backend Architecture

### Database Schema

#### Enhanced User Entity
```go
// internal/domain/entities/user.go
package entities

type UserRole string

const (
    UserRoleCustomer UserRole = "customer"
    UserRoleAdmin    UserRole = "admin"
)

type User struct {
    ID           int
    Email        string    // unique, for login
    PasswordHash string    // bcrypt hashed
    Name         string
    Phone        string    // Indonesian phone format
    Role         UserRole
    IsActive     bool      // can disable users
    CreatedAt    time.Time
    UpdatedAt    time.Time
}
```

#### RefreshToken Entity (New)
```go
// internal/domain/entities/refresh_token.go
package entities

import (
    "time"
    "github.com/google/uuid"
)

type RefreshToken struct {
    ID        uuid.UUID
    UserID    int
    Token     string     // hashed token for security
    ExpiresAt time.Time  // 30 days from creation
    CreatedAt time.Time
    RevokedAt *time.Time // null if still valid
}
```

#### Ent Schema Changes

**User Schema:**
```go
// internal/adapters/persistence/db/schema/user.go
func (User) Fields() []ent.Field {
    return []ent.Field{
        field.String("email").
            Unique().
            NotEmpty(),
        field.String("password_hash").
            Sensitive(). // hide in logs
            NotEmpty(),
        field.String("name").
            NotEmpty(),
        field.String("phone").
            Optional(),
        field.Enum("role").
            Values("customer", "admin").
            Default("customer"),
        field.Bool("is_active").
            Default(true),
        field.Time("created_at").
            Default(time.Now),
        field.Time("updated_at").
            Default(time.Now).
            UpdateDefault(time.Now),
    }
}

func (User) Edges() []ent.Edge {
    return []ent.Edge{
        edge.To("refresh_tokens", RefreshToken.Type),
    }
}
```

**RefreshToken Schema:**
```go
// internal/adapters/persistence/db/schema/refresh_token.go
func (RefreshToken) Fields() []ent.Field {
    return []ent.Field{
        field.UUID("id", uuid.UUID{}).
            Default(uuid.New),
        field.String("token").
            Unique().
            NotEmpty(),
        field.Time("expires_at"),
        field.Time("created_at").
            Default(time.Now),
        field.Time("revoked_at").
            Optional().
            Nillable(),
    }
}

func (RefreshToken) Edges() []ent.Edge {
    return []ent.Edge{
        edge.From("user", User.Type).
            Ref("refresh_tokens").
            Unique().
            Required(),
    }
}
```

### Authentication Flow

#### Registration Flow
1. User submits: email, password, name, phone
2. Validate email uniqueness (check existing user)
3. Hash password with bcrypt (cost 10)
4. Create user with `role=customer`, `is_active=true`
5. Return user data (without password_hash)

#### Login Flow
1. User submits: email + password
2. Find user by email
3. Verify password: `bcrypt.CompareHashAndPassword(user.PasswordHash, password)`
4. Generate access token (JWT, 15 min expiry)
5. Generate refresh token (UUID, 30 day expiry, store hashed in DB)
6. Return: `{ access_token, refresh_token, user, expires_in }`

#### Token Refresh Flow (Automatic)
1. Frontend detects 401 (access token expired)
2. Axios interceptor automatically calls `/api/auth/refresh` with refresh_token
3. Backend validates refresh token:
   - Check exists in DB
   - Check not revoked
   - Check not expired
4. Generate new access token
5. Optional: Rotate refresh token (generate new, revoke old)
6. Return new access_token
7. Retry original failed request with new token
8. **User experience: seamless, no manual action needed**

#### Logout Flow
1. Client submits refresh_token
2. Backend marks token as revoked (set `revoked_at` timestamp)
3. Client deletes both tokens from localStorage
4. Redirect to login page

### Domain Layer

#### Ports (Interfaces)

```go
// internal/domain/ports/auth_service.go
package ports

type AuthService interface {
    Register(ctx context.Context, input RegisterInput) (*entities.User, error)
    Login(ctx context.Context, email, password string) (*AuthResponse, error)
    RefreshToken(ctx context.Context, refreshToken string) (*AuthResponse, error)
    Logout(ctx context.Context, refreshToken string) error
    ValidateToken(ctx context.Context, accessToken string) (*entities.User, error)
}

type RegisterInput struct {
    Email    string
    Password string
    Name     string
    Phone    string
}

type AuthResponse struct {
    AccessToken  string
    RefreshToken string
    User         *entities.User
    ExpiresIn    int // seconds
}
```

```go
// internal/domain/ports/refresh_token_repository.go
package ports

type RefreshTokenRepository interface {
    Create(ctx context.Context, token *entities.RefreshToken) error
    FindByToken(ctx context.Context, token string) (*entities.RefreshToken, error)
    Revoke(ctx context.Context, token string) error
    RevokeAllForUser(ctx context.Context, userID int) error
    DeleteExpired(ctx context.Context) error // cleanup job
}
```

#### Update UserRepository
```go
// Add to internal/domain/ports/user_repository.go
FindByEmail(ctx context.Context, email string) (*entities.User, error)
```

### Application Layer

#### AuthService Implementation

```go
// internal/application/services/auth_service.go
package services

import (
    "context"
    "time"
    "github.com/golang-jwt/jwt/v5"
    "golang.org/x/crypto/bcrypt"
    "github.com/google/uuid"
)

type AuthServiceImpl struct {
    userRepo         ports.UserRepository
    refreshTokenRepo ports.RefreshTokenRepository
    jwtSecret        string
    accessTokenTTL   time.Duration // 15 minutes
    refreshTokenTTL  time.Duration // 30 days
}

func NewAuthService(
    userRepo ports.UserRepository,
    refreshTokenRepo ports.RefreshTokenRepository,
    jwtSecret string,
) *AuthServiceImpl {
    return &AuthServiceImpl{
        userRepo:         userRepo,
        refreshTokenRepo: refreshTokenRepo,
        jwtSecret:        jwtSecret,
        accessTokenTTL:   15 * time.Minute,
        refreshTokenTTL:  30 * 24 * time.Hour,
    }
}

func (s *AuthServiceImpl) Register(ctx context.Context, input ports.RegisterInput) (*entities.User, error) {
    // 1. Check email uniqueness
    existing, _ := s.userRepo.FindByEmail(ctx, input.Email)
    if existing != nil {
        return nil, domainErrors.NewValidationError("email already registered")
    }

    // 2. Hash password
    hashedPassword, err := bcrypt.GenerateFromPassword(
        []byte(input.Password),
        bcrypt.DefaultCost, // cost 10
    )
    if err != nil {
        return nil, err
    }

    // 3. Create user
    user := &entities.User{
        Email:        input.Email,
        PasswordHash: string(hashedPassword),
        Name:         input.Name,
        Phone:        input.Phone,
        Role:         entities.UserRoleCustomer,
        IsActive:     true,
    }

    if err := s.userRepo.Create(ctx, user); err != nil {
        return nil, err
    }

    return user, nil
}

func (s *AuthServiceImpl) Login(ctx context.Context, email, password string) (*ports.AuthResponse, error) {
    // 1. Find user by email
    user, err := s.userRepo.FindByEmail(ctx, email)
    if err != nil {
        return nil, domainErrors.NewNotFoundError("User", email)
    }

    // 2. Check if user is active
    if !user.IsActive {
        return nil, domainErrors.NewValidationError("account is disabled")
    }

    // 3. Verify password
    if err := bcrypt.CompareHashAndPassword(
        []byte(user.PasswordHash),
        []byte(password),
    ); err != nil {
        return nil, domainErrors.NewValidationError("invalid credentials")
    }

    // 4. Generate access token
    accessToken, err := s.generateAccessToken(user)
    if err != nil {
        return nil, err
    }

    // 5. Generate refresh token
    refreshToken, err := s.generateRefreshToken(ctx, user.ID)
    if err != nil {
        return nil, err
    }

    return &ports.AuthResponse{
        AccessToken:  accessToken,
        RefreshToken: refreshToken,
        User:         user,
        ExpiresIn:    int(s.accessTokenTTL.Seconds()),
    }, nil
}

func (s *AuthServiceImpl) RefreshToken(ctx context.Context, tokenString string) (*ports.AuthResponse, error) {
    // 1. Find token in database
    token, err := s.refreshTokenRepo.FindByToken(ctx, tokenString)
    if err != nil {
        return nil, domainErrors.NewNotFoundError("RefreshToken", tokenString)
    }

    // 2. Check if revoked
    if token.RevokedAt != nil {
        return nil, domainErrors.NewValidationError("token has been revoked")
    }

    // 3. Check if expired
    if time.Now().After(token.ExpiresAt) {
        return nil, domainErrors.NewValidationError("token has expired")
    }

    // 4. Get user
    user, err := s.userRepo.GetByID(ctx, token.UserID)
    if err != nil {
        return nil, err
    }

    // 5. Generate new access token
    accessToken, err := s.generateAccessToken(user)
    if err != nil {
        return nil, err
    }

    // 6. Optional: Rotate refresh token (recommended for security)
    // Revoke old token and generate new one
    // For MVP, we can skip rotation

    return &ports.AuthResponse{
        AccessToken:  accessToken,
        RefreshToken: tokenString, // return same refresh token
        User:         user,
        ExpiresIn:    int(s.accessTokenTTL.Seconds()),
    }, nil
}

func (s *AuthServiceImpl) Logout(ctx context.Context, refreshToken string) error {
    return s.refreshTokenRepo.Revoke(ctx, refreshToken)
}

func (s *AuthServiceImpl) ValidateToken(ctx context.Context, tokenString string) (*entities.User, error) {
    // Parse JWT token
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return []byte(s.jwtSecret), nil
    })

    if err != nil || !token.Valid {
        return nil, domainErrors.NewValidationError("invalid token")
    }

    // Extract user ID from claims
    claims := token.Claims.(jwt.MapClaims)
    userID := int(claims["user_id"].(float64))

    // Get user from database
    return s.userRepo.GetByID(ctx, userID)
}

// Helper: Generate Access Token (JWT)
func (s *AuthServiceImpl) generateAccessToken(user *entities.User) (string, error) {
    claims := jwt.MapClaims{
        "user_id": user.ID,
        "email":   user.Email,
        "role":    user.Role,
        "exp":     time.Now().Add(s.accessTokenTTL).Unix(),
        "iat":     time.Now().Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(s.jwtSecret))
}

// Helper: Generate Refresh Token (UUID)
func (s *AuthServiceImpl) generateRefreshToken(ctx context.Context, userID int) (string, error) {
    tokenString := uuid.New().String()

    // Hash token before storing (security best practice)
    hashedToken, err := bcrypt.GenerateFromPassword([]byte(tokenString), bcrypt.DefaultCost)
    if err != nil {
        return "", err
    }

    refreshToken := &entities.RefreshToken{
        UserID:    userID,
        Token:     string(hashedToken),
        ExpiresAt: time.Now().Add(s.refreshTokenTTL),
    }

    if err := s.refreshTokenRepo.Create(ctx, refreshToken); err != nil {
        return "", err
    }

    return tokenString, nil
}
```

### API Layer

#### DTOs

```go
// internal/adapters/api/dto/auth_dto.go
package dto

type RegisterRequest struct {
    Email    string `json:"email" validate:"required,email" example:"user@example.com"`
    Password string `json:"password" validate:"required,min=8" example:"Password123!"`
    Name     string `json:"name" validate:"required,min=2" example:"John Doe"`
    Phone    string `json:"phone" validate:"required" example:"081234567890"`
}

type LoginRequest struct {
    Email    string `json:"email" validate:"required,email"`
    Password string `json:"password" validate:"required"`
}

type RefreshTokenRequest struct {
    RefreshToken string `json:"refresh_token" validate:"required"`
}

type LogoutRequest struct {
    RefreshToken string `json:"refresh_token" validate:"required"`
}

type AuthResponse struct {
    AccessToken  string   `json:"access_token" example:"eyJhbGci..."`
    RefreshToken string   `json:"refresh_token" example:"550e8400-e29b-41d4-a716-446655440000"`
    ExpiresIn    int      `json:"expires_in" example:"900"`
    User         UserData `json:"user"`
}

type UserData struct {
    ID       int    `json:"id" example:"1"`
    Email    string `json:"email" example:"user@example.com"`
    Name     string `json:"name" example:"John Doe"`
    Phone    string `json:"phone" example:"081234567890"`
    Role     string `json:"role" example:"customer"`
    IsActive bool   `json:"is_active" example:"true"`
}
```

#### Handlers

```go
// internal/adapters/api/handlers/auth_handler.go
package handlers

import (
    "github.com/danielgtaylor/huma/v2"
)

type AuthHandler struct {
    authService ports.AuthService
}

func NewAuthHandler(authService ports.AuthService) *AuthHandler {
    return &AuthHandler{authService: authService}
}

func (h *AuthHandler) RegisterRoutes(api huma.API) {
    huma.Register(api, huma.Operation{
        OperationID: "register",
        Method:      "POST",
        Path:        "/auth/register",
        Summary:     "Register new user",
        Tags:        []string{"Authentication"},
    }, h.Register)

    huma.Register(api, huma.Operation{
        OperationID: "login",
        Method:      "POST",
        Path:        "/auth/login",
        Summary:     "Login user",
        Tags:        []string{"Authentication"},
    }, h.Login)

    huma.Register(api, huma.Operation{
        OperationID: "refresh",
        Method:      "POST",
        Path:        "/auth/refresh",
        Summary:     "Refresh access token",
        Tags:        []string{"Authentication"},
    }, h.RefreshToken)

    huma.Register(api, huma.Operation{
        OperationID: "logout",
        Method:      "POST",
        Path:        "/auth/logout",
        Summary:     "Logout user",
        Tags:        []string{"Authentication"},
    }, h.Logout)

    huma.Register(api, huma.Operation{
        OperationID: "getCurrentUser",
        Method:      "GET",
        Path:        "/auth/me",
        Summary:     "Get current user",
        Tags:        []string{"Authentication"},
        Security: []map[string][]string{
            {"bearer": {}},
        },
    }, h.GetCurrentUser)
}

func (h *AuthHandler) Register(ctx context.Context, input *struct {
    Body dto.RegisterRequest
}) (*struct{ Body dto.AuthResponse }, error) {
    // Implementation
}

func (h *AuthHandler) Login(ctx context.Context, input *struct {
    Body dto.LoginRequest
}) (*struct{ Body dto.AuthResponse }, error) {
    // Implementation
}

// ... other handlers
```

#### Middleware

```go
// internal/adapters/api/middleware/auth.go
package middleware

import (
    "strings"
    "github.com/gofiber/fiber/v2"
)

func RequireAuth(authService ports.AuthService) fiber.Handler {
    return func(c *fiber.Ctx) error {
        // 1. Extract token from Authorization header
        authHeader := c.Get("Authorization")
        if authHeader == "" {
            return fiber.NewError(fiber.StatusUnauthorized, "missing authorization header")
        }

        // 2. Parse Bearer token
        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
            return fiber.NewError(fiber.StatusUnauthorized, "invalid authorization format")
        }

        token := parts[1]

        // 3. Validate token and get user
        user, err := authService.ValidateToken(c.Context(), token)
        if err != nil {
            return fiber.NewError(fiber.StatusUnauthorized, "invalid or expired token")
        }

        // 4. Store user in context
        c.Locals("user", user)

        return c.Next()
    }
}

func RequireAdmin() fiber.Handler {
    return func(c *fiber.Ctx) error {
        user := c.Locals("user").(*entities.User)

        if user.Role != entities.UserRoleAdmin {
            return fiber.NewError(fiber.StatusForbidden, "admin access required")
        }

        return c.Next()
    }
}
```

#### Dependency Injection

```go
// cmd/api/main.go (updated)

// Initialize repositories
userRepo := persistence.NewUserRepository(client)
refreshTokenRepo := persistence.NewRefreshTokenRepository(client)

// Initialize services
jwtSecret := os.Getenv("JWT_SECRET") // from .env
authService := services.NewAuthService(userRepo, refreshTokenRepo, jwtSecret)

// Initialize handlers
authHandler := handlers.NewAuthHandler(authService)

// Register routes
authHandler.RegisterRoutes(humaAPI)

// Protected routes example
api := app.Group("/api")
api.Get("/profile",
    middleware.RequireAuth(authService),
    profileHandler.GetProfile,
)

// Admin routes example
admin := api.Group("/admin",
    middleware.RequireAuth(authService),
    middleware.RequireAdmin(),
)
admin.Get("/dashboard", adminHandler.Dashboard)
```

---

## Frontend Architecture

### Project Restructure

**New Directory Structure:**
```
src/
├── features/
│   └── auth/
│       ├── components/
│       │   ├── login-form.tsx
│       │   ├── login-form.test.tsx
│       │   ├── register-form.tsx
│       │   ├── register-form.test.tsx
│       │   └── profile-form.tsx
│       ├── api/
│       │   ├── mutations.ts      # login, register, logout
│       │   └── queries.ts        # getCurrentUser
│       ├── store/
│       │   └── auth-store.ts     # Zustand store
│       ├── types.ts
│       ├── utils.ts              # token helpers
│       └── index.ts              # barrel export
├── services/
│   └── api/
│       ├── client.ts             # Axios instance + interceptors
│       └── config.ts             # API base URL
├── components/
│   ├── layout/
│   │   ├── protected-route.tsx  # HOC for auth
│   │   └── header.tsx           # Update with auth state
│   └── common/
├── lib/
│   ├── utils/
│   └── constants/
└── routes/
    ├── login.tsx
    ├── register.tsx
    └── profile.tsx
```

### Auth Store (Zustand)

```typescript
// features/auth/store/auth-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean

  // Actions
  login: (accessToken: string, refreshToken: string, user: User) => void
  logout: () => void
  setAccessToken: (token: string) => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: (accessToken, refreshToken, user) => set({
        accessToken,
        refreshToken,
        user,
        isAuthenticated: true,
      }),

      logout: () => set({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
      }),

      setAccessToken: (token) => set({ accessToken: token }),

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Only persist these fields
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
)
```

### API Client with Auto-Refresh

```typescript
// services/api/client.ts
import axios from 'axios'
import { useAuthStore } from '@/features/auth'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: Attach access token to every request
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: Auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Only retry once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { refreshToken } = useAuthStore.getState()

        // No refresh token? Force logout
        if (!refreshToken) {
          useAuthStore.getState().logout()
          window.location.href = '/login'
          return Promise.reject(error)
        }

        // Call refresh endpoint (don't use interceptor for this)
        const { data } = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          { refresh_token: refreshToken }
        )

        // Update access token in store
        useAuthStore.getState().setAccessToken(data.access_token)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`
        return apiClient(originalRequest)

      } catch (refreshError) {
        // Refresh failed (expired/invalid), force logout
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
```

### Auth API (TanStack Query)

```typescript
// features/auth/api/mutations.ts
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import apiClient from '@/services/api/client'
import { useAuthStore } from '../store/auth-store'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types'

export function useLogin() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const { data } = await apiClient.post<AuthResponse>(
        '/auth/login',
        credentials
      )
      return data
    },
    onSuccess: (data) => {
      login(data.access_token, data.refresh_token, data.user)
      navigate({ to: '/' })
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: async (input: RegisterRequest) => {
      const { data } = await apiClient.post<AuthResponse>(
        '/auth/register',
        input
      )
      return data
    },
    onSuccess: (data) => {
      // Auto-login after successful registration
      login(data.access_token, data.refresh_token, data.user)
      navigate({ to: '/' })
    },
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const { logout, refreshToken } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await apiClient.post('/auth/logout', {
          refresh_token: refreshToken
        })
      }
    },
    onSettled: () => {
      // Always logout locally, even if API call fails
      logout()
      navigate({ to: '/login' })
    },
  })
}
```

```typescript
// features/auth/api/queries.ts
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/services/api/client'
import { useAuthStore } from '../store/auth-store'
import type { User } from '../types'

export function useCurrentUser() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await apiClient.get<User>('/auth/me')
      return data
    },
    enabled: isAuthenticated, // Only fetch if authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

### Protected Routes

```typescript
// components/layout/protected-route.tsx
import { Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({
  children,
  requireAdmin = false
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" />
  }

  return <>{children}</>
}
```

### Login Form Component

```typescript
// features/auth/components/login-form.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLogin } from '../api/mutations'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 rounded">
          <p className="text-sm text-red-500">
            {error.response?.data?.message || 'Login failed. Please try again.'}
          </p>
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  )
}
```

### Route Files (Thin)

```typescript
// routes/login.tsx
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/components/login-form'
import { useAuthStore } from '@/features/auth'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { isAuthenticated } = useAuthStore()

  // Redirect to home if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full p-8 bg-white/5 border border-white/10">
        <h1 className="text-2xl font-black mb-6 text-white">LOGIN</h1>
        <LoginForm />
      </div>
    </div>
  )
}
```

---

## Implementation Checklist

### Backend (Week 1) - go-yippi

#### Day 1-2: Setup & Schema
- [ ] Install dependencies
  ```bash
  go get github.com/golang-jwt/jwt/v5
  # bcrypt already available in golang.org/x/crypto/bcrypt
  ```
- [ ] Update User entity (`internal/domain/entities/user.go`)
  - [ ] Add Email, PasswordHash, Phone, Role, IsActive fields
  - [ ] Add UserRole type and constants
- [ ] Create RefreshToken entity (`internal/domain/entities/refresh_token.go`)
- [ ] Update User Ent schema (`internal/adapters/persistence/db/schema/user.go`)
  - [ ] Add new fields with validation
  - [ ] Add edge to refresh_tokens
- [ ] Create RefreshToken Ent schema (`internal/adapters/persistence/db/schema/refresh_token.go`)
  - [ ] Add fields: id (UUID), token, expires_at, revoked_at
  - [ ] Add edge from user
- [ ] Run `make generate` to generate Ent code
- [ ] Test migration (start app, verify tables created in PostgreSQL)
- [ ] Verify foreign key relationship in database

#### Day 3-4: Repositories & Services
- [ ] Create RefreshTokenRepository port (`internal/domain/ports/refresh_token_repository.go`)
- [ ] Implement RefreshTokenRepository (`internal/adapters/persistence/refresh_token_repository.go`)
  - [ ] Create method
  - [ ] FindByToken method (with hash comparison)
  - [ ] Revoke method
  - [ ] RevokeAllForUser method
  - [ ] DeleteExpired method
- [ ] Update UserRepository
  - [ ] Add FindByEmail method to port
  - [ ] Implement in `internal/adapters/persistence/user_repository.go`
- [ ] Create AuthService port (`internal/domain/ports/auth_service.go`)
  - [ ] Define interface methods
  - [ ] Define input/output types
- [ ] Implement AuthService (`internal/application/services/auth_service.go`)
  - [ ] Register method (with bcrypt hashing)
  - [ ] Login method (password verification + token generation)
  - [ ] RefreshToken method (validation + new token)
  - [ ] Logout method (token revocation)
  - [ ] ValidateToken method (JWT parsing)
  - [ ] Helper: generateAccessToken (JWT)
  - [ ] Helper: generateRefreshToken (UUID + hash)
- [ ] Write unit tests (`internal/application/services/auth_service_test.go`)
  - [ ] Test Register (success, duplicate email, password hashing)
  - [ ] Test Login (success, wrong password, non-existent user)
  - [ ] Test RefreshToken (success, expired, revoked)
  - [ ] Test Logout
  - [ ] Run: `go test ./internal/application/services -v`

#### Day 5-6: API Handlers & Middleware
- [ ] Create auth DTOs (`internal/adapters/api/dto/auth_dto.go`)
  - [ ] RegisterRequest, LoginRequest, RefreshTokenRequest, LogoutRequest
  - [ ] AuthResponse, UserData
  - [ ] Add validation tags
- [ ] Create auth handler (`internal/adapters/api/handlers/auth_handler.go`)
  - [ ] POST /auth/register handler
  - [ ] POST /auth/login handler
  - [ ] POST /auth/refresh handler
  - [ ] POST /auth/logout handler
  - [ ] GET /auth/me handler (protected)
  - [ ] RegisterRoutes method
- [ ] Create JWT middleware (`internal/adapters/api/middleware/auth.go`)
  - [ ] RequireAuth middleware (extract & validate JWT)
  - [ ] RequireAdmin middleware (check role)
  - [ ] Helper: extract token from Authorization header
- [ ] Update dependency injection (`cmd/api/main.go`)
  - [ ] Initialize RefreshTokenRepository
  - [ ] Initialize AuthService with JWT secret from env
  - [ ] Initialize AuthHandler
  - [ ] Register auth routes
  - [ ] Apply middleware to protected routes
- [ ] Add environment variables (`.env`)
  ```
  JWT_SECRET=your-super-secret-key-change-in-production
  JWT_ACCESS_TOKEN_TTL=15m
  JWT_REFRESH_TOKEN_TTL=720h
  ```

#### Day 7: Testing & Seed Data
- [ ] Test API endpoints via Huma docs (`http://localhost:8080/docs`)
  - [ ] POST /auth/register - create test user
  - [ ] POST /auth/login - verify tokens returned
  - [ ] GET /auth/me - verify protected route works
  - [ ] POST /auth/refresh - verify token refresh
  - [ ] POST /auth/logout - verify token revoked
- [ ] Test error cases
  - [ ] Register with duplicate email
  - [ ] Login with wrong password
  - [ ] Access protected route without token
  - [ ] Access protected route with expired token
  - [ ] Access admin route as customer
- [ ] Create seed script for admin user (`cmd/seed/main.go`)
  ```go
  // Create admin user
  admin := &entities.User{
      Email: "admin@example.com",
      Password: "admin123",
      Name: "Admin User",
      Role: entities.UserRoleAdmin,
  }
  authService.Register(ctx, admin)
  ```
- [ ] Run full integration test (register → login → access protected route → refresh → logout)
- [ ] Check database: verify users and refresh_tokens tables populated correctly

### Frontend (Week 2) - shad-yippi

#### Day 1-2: Project Restructure
- [ ] Create feature folders
  ```bash
  mkdir -p src/features/auth/{components,api,store}
  mkdir -p src/services/api
  ```
- [ ] Create API client (`services/api/client.ts`)
  - [ ] Setup axios instance
  - [ ] Add request interceptor (attach token)
  - [ ] Add response interceptor (auto-refresh on 401)
- [ ] Create API config (`services/api/config.ts`)
  - [ ] Define API_BASE_URL
- [ ] Add environment variable (`.env`)
  ```
  VITE_API_URL=http://localhost:8080/api
  ```
- [ ] Test API connection
  ```typescript
  // Quick test in console
  apiClient.get('/products').then(console.log)
  ```

#### Day 3-4: Auth Feature
- [ ] Create auth types (`features/auth/types.ts`)
  - [ ] User, LoginRequest, RegisterRequest, AuthResponse
- [ ] Create auth store (`features/auth/store/auth-store.ts`)
  - [ ] Zustand store with persist
  - [ ] login, logout, setAccessToken, setUser actions
- [ ] Create auth mutations (`features/auth/api/mutations.ts`)
  - [ ] useLogin hook
  - [ ] useRegister hook
  - [ ] useLogout hook
- [ ] Create auth queries (`features/auth/api/queries.ts`)
  - [ ] useCurrentUser hook
- [ ] Create LoginForm component (`features/auth/components/login-form.tsx`)
  - [ ] React Hook Form + Zod validation
  - [ ] Call useLogin mutation
  - [ ] Show loading & error states
- [ ] Create RegisterForm component (`features/auth/components/register-form.tsx`)
  - [ ] Form fields: email, password, name, phone
  - [ ] Call useRegister mutation
- [ ] Create barrel export (`features/auth/index.ts`)
- [ ] Write component tests
  - [ ] login-form.test.tsx
  - [ ] register-form.test.tsx

#### Day 5-6: Routes & Protection
- [ ] Create ProtectedRoute component (`components/layout/protected-route.tsx`)
  - [ ] Check isAuthenticated, redirect to /login if not
  - [ ] Check role for admin routes
- [ ] Create login route (`routes/login.tsx`)
  - [ ] Render LoginForm
  - [ ] Redirect to home if already authenticated
- [ ] Create register route (`routes/register.tsx`)
  - [ ] Render RegisterForm
  - [ ] Redirect to home if already authenticated
- [ ] Create profile route (`routes/profile.tsx`)
  - [ ] Wrap in ProtectedRoute
  - [ ] Fetch current user with useCurrentUser
  - [ ] Display user info (name, email, phone, role)
- [ ] Update Header component (`components/layout/header.tsx`)
  - [ ] Show "Login" button if not authenticated
  - [ ] Show "Profile" + "Logout" button if authenticated
  - [ ] Display user name
- [ ] Add loading states
  - [ ] Show spinner during login/register
  - [ ] Show loading skeleton on profile page

#### Day 7: Integration & Polish
- [ ] Test complete auth flow
  - [ ] Register new user → auto-login → redirect to home
  - [ ] Login existing user → redirect to home
  - [ ] Access profile page → see user data
  - [ ] Logout → redirect to login
- [ ] Test token auto-refresh
  - [ ] Login → wait 15 min → make API call → verify auto-refresh
  - [ ] Check network tab for /auth/refresh call
  - [ ] Verify no user interruption
- [ ] Test protected routes
  - [ ] Try accessing /profile without login → redirect to /login
  - [ ] Try accessing /admin as customer → redirect to home
- [ ] Test edge cases
  - [ ] Network error during login
  - [ ] Expired refresh token (force logout)
  - [ ] Token refresh during active request
  - [ ] Multiple concurrent 401 responses (only refresh once)
- [ ] Add toast notifications (using sonner)
  - [ ] Success: "Login successful", "Logged out"
  - [ ] Error: "Invalid credentials", "Registration failed"
- [ ] Polish UI
  - [ ] Loading spinners
  - [ ] Error message styling
  - [ ] Form validation feedback
  - [ ] Responsive design (mobile/desktop)
- [ ] Final QA
  - [ ] Test on different browsers
  - [ ] Test refresh token expiry (30 days later, mock with backend)
  - [ ] Verify localStorage persistence (refresh page, still logged in)

---

## Testing Strategy

### Backend Unit Tests

```go
// internal/application/services/auth_service_test.go
package services_test

import (
    "testing"
    "context"
    "github.com/stretchr/testify/assert"
)

func TestAuthService_Register(t *testing.T) {
    t.Run("successful registration", func(t *testing.T) {
        // Setup: mock repositories
        // Action: call Register
        // Assert: user created, password hashed
    })

    t.Run("duplicate email", func(t *testing.T) {
        // Assert: returns validation error
    })

    t.Run("password is hashed", func(t *testing.T) {
        // Assert: PasswordHash != plaintext password
        // Assert: bcrypt.CompareHashAndPassword succeeds
    })
}

func TestAuthService_Login(t *testing.T) {
    t.Run("successful login", func(t *testing.T) {
        // Assert: tokens generated
        // Assert: user data returned
    })

    t.Run("wrong password", func(t *testing.T) {
        // Assert: returns validation error
    })

    t.Run("non-existent user", func(t *testing.T) {
        // Assert: returns not found error
    })

    t.Run("inactive user", func(t *testing.T) {
        // Assert: returns validation error
    })
}

func TestAuthService_RefreshToken(t *testing.T) {
    t.Run("successful refresh", func(t *testing.T) {
        // Assert: new access token generated
    })

    t.Run("expired token", func(t *testing.T) {
        // Assert: returns validation error
    })

    t.Run("revoked token", func(t *testing.T) {
        // Assert: returns validation error
    })
}
```

### Frontend Component Tests

```typescript
// features/auth/components/login-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from './login-form'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />, { wrapper })
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('shows validation errors for invalid email', async () => {
    render(<LoginForm />, { wrapper })
    const emailInput = screen.getByLabelText(/email/i)

    fireEvent.change(emailInput, { target: { value: 'invalid' } })
    fireEvent.blur(emailInput)

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })

  it('shows validation errors for short password', async () => {
    render(<LoginForm />, { wrapper })
    const passwordInput = screen.getByLabelText(/password/i)

    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.blur(passwordInput)

    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument()
    })
  })

  it('calls login mutation on submit', async () => {
    // Mock useLogin hook
    // Submit form
    // Assert mutation called with correct data
  })

  it('shows error message on failed login', async () => {
    // Mock failed login
    // Assert error message displayed
  })
})
```

---

## Environment Variables

### Backend (.env)
```bash
# Server
SERVER_PORT=8080
SERVER_HOST=0.0.0.0

# Database
DB_DSN="host=localhost port=5432 user=admin dbname=go-test password=adminadmin sslmode=disable"

# JWT
JWT_SECRET=your-super-secret-key-change-in-production-min-32-chars
JWT_ACCESS_TOKEN_TTL=15m
JWT_REFRESH_TOKEN_TTL=720h  # 30 days

# Optional: Token rotation
JWT_ROTATE_REFRESH_TOKEN=false
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8080/api
```

---

## Success Criteria

### Must Have (Phase 1 Complete)
- ✅ User can register with email, password, name, phone
- ✅ User can login and receive access + refresh tokens
- ✅ Access token auto-refreshes transparently (no user action)
- ✅ User can logout (tokens revoked in database)
- ✅ Protected routes redirect to /login if not authenticated
- ✅ Admin routes only accessible by users with admin role
- ✅ Frontend refactored to feature-based architecture
- ✅ All auth API endpoints working with validation
- ✅ Unit tests passing (backend AuthService)
- ✅ Component tests passing (LoginForm, RegisterForm)
- ✅ JWT middleware working correctly
- ✅ Password hashing with bcrypt
- ✅ Refresh tokens stored in database with expiry
- ✅ API client with auto-refresh interceptors

### Nice to Have (If Time Permits)
- Password strength indicator on register form
- "Remember me" checkbox (extend refresh token TTL)
- Login activity log (track last login time, IP)
- Email verification flow
- Forgot password flow
- Social login (Google OAuth)
- Two-factor authentication (2FA)

### Quality Gates
- [ ] All unit tests pass (`go test ./... -v`)
- [ ] All component tests pass (`bun test`)
- [ ] No TypeScript errors (`bun tsc --noEmit`)
- [ ] No linting errors (`bun run lint`)
- [ ] Manual testing checklist completed
- [ ] API documented in Huma OpenAPI
- [ ] Code reviewed (if team > 1 person)

---

## Risk Mitigation

### Risk 1: Token Security
**Concern:** Storing tokens in localStorage vulnerable to XSS

**Mitigation:**
- For MVP, localStorage is acceptable with proper CSP headers
- Post-MVP: Migrate to httpOnly cookies for refresh tokens
- Implement strict Content Security Policy
- Sanitize all user inputs to prevent XSS

### Risk 2: Refresh Token Rotation
**Concern:** Reusing refresh tokens reduces security

**Mitigation:**
- For MVP, we'll reuse refresh tokens (simpler)
- Add rotation in Phase 2 if needed
- Set `JWT_ROTATE_REFRESH_TOKEN=true` env variable when ready

### Risk 3: Concurrent Token Refresh
**Concern:** Multiple 401s could trigger multiple refresh calls

**Mitigation:**
- Axios interceptor uses `_retry` flag to only retry once per request
- Consider using mutex/lock for refresh operation (advanced)

### Risk 4: Password Recovery
**Concern:** No forgot password flow in Phase 1

**Mitigation:**
- Document as known limitation
- Admin can manually reset user passwords via database
- Add proper flow in Phase 2

---

## Next Steps After Phase 1

Once Phase 1 is complete and all success criteria met:

1. **Code Review & Merge**
   - Review all code changes
   - Merge feature branches to main
   - Tag release: `v0.1.0-phase1`

2. **Documentation Update**
   - Update README with auth setup instructions
   - Document API endpoints in main docs
   - Add architecture diagrams

3. **Move to Phase 2**
   - Cart persistence (database-backed)
   - Product catalog integration
   - Real search & filters

4. **Optional Enhancements**
   - Add email verification
   - Implement forgot password
   - Add OAuth providers

---

**Document Status:** Final
**Ready for Implementation:** Yes
**Estimated Duration:** 2 weeks (Week 1-2)
