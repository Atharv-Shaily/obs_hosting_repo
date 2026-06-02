# Project Implementation Plan: Trek Booking Backend

## 1. Tech Stack & Environment
* **Runtime:** Node.js
* **Language:** Strict TypeScript
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose
* **Architecture:** Controller-Service-Route modular pattern

## 2. Core Constraints (AI DIRECTIVES)
* ALWAYS use ES6 imports/exports.
* ALWAYS define explicit TypeScript interfaces for Mongoose documents.
* NEVER write business logic inside the route files; delegate to controllers/services.
* Implement standard `try/catch` blocks in all asynchronous controllers.
* Wait for my explicit approval before moving to the next Phase.

## 3. Database Schemas (Source of Truth)
Before writing any controllers, ensure these Mongoose models exist in `src/models/`:
* `User`: email (String, unique), passwordHash (String), loyaltyPoints (Number, default: 0), rank (String, enum: ['Novice', 'Explorer', 'Sherpa']).
* `Trek`: title (String), description (String), loyaltyReward (Number).
* `Booking`: userId (Ref: User), trekId (Ref: Trek), status (String, enum: ['Pending', 'Completed']).
* `LoyaltyHistory`: userId (Ref: User), trekId (Ref: Trek), pointsEarned (Number), transactionDate (Date).

## 4. Execution Phases

### Phase 1: Foundation & Models
1.  Initialize `package.json` and `tsconfig.json`.
2.  Set up database connection in `src/config/db.ts`.
3.  Create the 4 Mongoose models matching the exact schemas above in `src/models/`.
4.  Set up the base Express server in `src/index.ts`.

### Phase 2: Authentication System
1.  Create `src/middlewares/authGuard.ts` to verify JWTs.
2.  Create `src/services/authService.ts` for bcrypt hashing and JWT signing.
3.  Create `src/controllers/authController.ts` (register, login).
4.  Create `src/routes/authRoutes.ts` and mount to `/api/auth` in `index.ts`.

### Phase 3: Loyalty & Booking Business Logic
1.  Create `src/services/loyaltyService.ts`. Implement a function `processCompletedTrek(userId, trekId)` that adds points to the user, recalculates rank, and logs to `LoyaltyHistory`.
2.  Create `src/controllers/bookingController.ts`. When a booking status updates to "Completed", trigger `processCompletedTrek`.
3.  Create `src/routes/bookingRoutes.ts` and protect them with `authGuard`.

### Phase 4: User Profile Integration
1.  Create `src/controllers/userController.ts`. 
2.  Implement endpoint to fetch the user's current profile, points, and rank.
3.  Implement endpoint to fetch the user's `LoyaltyHistory` array, populated with Trek names.

## 5. Frontend Execution Phases (React)

### Phase 5: Authentication State & API Setup
1. Create `src/api/axios.ts` (or standard fetch wrapper) configured to intercept requests and attach the JWT token from `localStorage` to the `Authorization` header.
2. Create `src/context/AuthContext.tsx`. It should manage the global state for `user` (id, email, rank, loyaltyPoints) and `isAuthenticated`. Include `login`, `register`, and `logout` functions.
3. Create `src/components/ProtectedRoute.tsx`. This component should wrap routes and redirect users to `/auth` if `isAuthenticated` is false.
4. Wrap the entire application in `App.tsx` or `main.tsx` with the `AuthProvider`.

### Phase 6: Auth UI & Navigation
1. Create `src/pages/AuthPage.tsx`. It should contain toggleable forms for "Login" and "Register". On successful submission, save the JWT to `localStorage` and update the `AuthContext`.
2. Update `src/components/Layout.tsx` (the Navigation Bar). 
   - If logged out: Show a "Sign In" button.
   - If logged in: Show the user's Rank, a "Profile" link, and a "Logout" button.

### Phase 7: Profile & Loyalty UI
1. Create `src/pages/ProfilePage.tsx`. This page must display:
   - The user's current Rank (e.g., L2 – Pahaadi Soul) and total loyaltyPoints.
   - A visual list or table mapping over `LoyaltyHistory` fetched from the backend.
2. Add the `/profile` route to `App.tsx` and wrap it in `<ProtectedRoute>`.

### Phase 8: Trek Booking Integration
1. Update `src/pages/UpcomingPage.tsx`. Ensure the "Book Now" button routes the user to the booking flow.
2. If an unauthenticated user clicks "Book Now", redirect them to `AuthPage.tsx` with a return URL so they can resume booking after logging in.