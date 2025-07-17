# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2024-07-26

This version represents a major push to move the project from a mocked prototype to a feature-rich, stable client-side application ready for backend integration.

### Added
- **Checkout Page**: Implemented a full checkout page (`/checkout`) with address forms, order summary, and payment method selection.
- **KNET Payment Flow (Client-Side)**: Structured the entire client-side KNET payment flow.
  - Added `initiateKnetPayment` and `verifyKnetPayment` to `OrderService` to handle backend communication.
  - Created `KnetCallbackPage.tsx` to process the user's return from the KNET gateway, call the verification service, and redirect to success/error pages.
- **Admin User Management Form**: Created a reusable `UserForm.tsx` component for adding and editing users.
- **Admin Order Details Page**: Implemented a new page (`AdminOrderDetailsPage.tsx`) to show detailed information for a single order.
- **Dynamic Admin Dashboard**: The admin dashboard is now powered by the `AnalyticsService`, displaying dynamic widgets for sales, products, and user metrics instead of mock data.
- **Comprehensive Permission System**: Implemented a robust, role-based permission system in `AuthContext` that checks against a user's permissions array, including wildcard support.

### Changed
- **Service Layer Refactoring**:
  - `SettingsService.ts` and `ChangelogService.ts` now make live Supabase CRUD calls.
  - `AnalyticsService.ts` methods now all call specific conceptual backend RPCs.
  - `OrderService.createOrder` now calls a single conceptual RPC (`create_order_transactionally`) to ensure atomicity.
  - `ProductService.getProducts` now returns a `total` count for accurate pagination.
- **Mock Data Removal**: Systematically removed all mock data imports and usage from all pages and components, including `AdminProducts`, `DealsPage`, `ProductDetailPage`, `WishlistModal`, and `AdminUsers`. All components now fetch data from their respective services.
- **Admin Orders Page**: Refactored to fetch real order data and link to the new Order Details page.
- **Admin Users Page**: Refactored to fetch real user data and integrated the new `UserForm` for add/edit functionality.

### Fixed
- **Critical Build Errors**: Resolved all build-blocking errors, primarily related to incorrect mock data imports and syntax errors. The project now builds successfully.
- **ESLint Issues**: Performed a major code quality pass, fixing all `no-unused-vars` errors across the project, along with other issues like `no-case-declarations` and `prefer-const`. This has significantly cleaned up the codebase.

## [1.1.0] - 2024-07-25

This version focused on the initial refactoring of core services from mock data to live Supabase integration and conducting a full project audit.

### Added
- **`PROJECT_COMPLETION_STATUS.md`**: Created a detailed audit document to track finished and unfinished tasks and provide time estimates.
- **Supabase Integration in Services**:
  - `ProductService.ts` fully refactored to perform all product and category CRUD operations against a Supabase backend.
  - `AuthService.ts` fully refactored to handle user profile management in the `profiles` table.
  - `OrderService.ts` refactored to handle basic order creation and fetching from Supabase.
- **`AGENTS.md`**: Created a guide for AI agents and developers working on the project.

### Changed
- **`AuthContext.tsx`**: Updated to use the real `useSupabase` hook and `AuthService` for live authentication.
- **`AdminContext.tsx`**: Updated to load initial product data from `ProductService`.

### Fixed
- **Initial Setup Scripts**: Refined and documented the VPS deployment and server start/stop scripts.
- **Environment Variable Handling**: Clarified the use of `VITE_` prefixed variables and the security requirements for the KNET secret key.

## [1.0.0] - 2024-07-24

Initial project setup and implementation of all major features with mock data.

### Added
- Initial project structure with Vite, React, TypeScript, and Tailwind CSS.
- All UI components and pages for the e-commerce store and admin panel.
- All services (`ProductService`, `OrderService`, etc.) implemented with mock data.
- Complete routing for public and admin sections.
- Core contexts (`AppContext`, `AdminContext`, `AuthContext`) for state management.
