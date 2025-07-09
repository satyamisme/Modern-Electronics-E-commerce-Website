# LAKKI PHONES - Agent Guidelines (AGENTS.md)

This document provides guidelines and key information for AI agents (and human developers) working on the LAKKI PHONES e-commerce platform codebase.

## 1. Project Overview

*   **Description:** A modern, full-featured e-commerce platform built with React, TypeScript, and Tailwind CSS, using Vite as the build tool. It is specifically optimized for the Kuwait market, featuring KWD currency and KNET payment integration.
*   **Primary Backend:** Supabase (handles Authentication, Database). Supabase Edge Functions can be used for server-side logic.
*   **Key Technologies:** React, TypeScript, Vite, Tailwind CSS, Supabase, Axios, Cheerio (for scraping).

## 2. Backend Architecture & Data Flow

*   **Supabase as BaaS:** The project relies heavily on Supabase for its backend needs.
    *   **Authentication:** Managed by Supabase Auth. See `src/services/authService.ts` and `src/hooks/useSupabase.ts`.
    *   **Database:** Uses Supabase PostgreSQL. Schema migrations are in `supabase/migrations/`. Table type definitions are conceptually in `src/lib/supabase.ts` (`Database` interface).
*   **Service Layer (`src/services/`):**
    *   This is the primary abstraction layer for interacting with the backend (Supabase) and external APIs.
    *   **Always prefer using or extending a service method over making direct Supabase client calls from UI components or pages.**
    *   **Service Status:**
        *   **Fully Integrated with Supabase:**
            *   `AuthService.ts`: Handles user authentication and profile data from the `profiles` table.
            *   `ProductService.ts`: Handles CRUD for products, categories, and product images from their respective Supabase tables.
            *   `OrderService.ts`: Handles order creation and management in Supabase tables.
        *   **Partially Implemented/Mocked (Backend Pending):**
            *   `AnalyticsService.ts`: The client-side service structure exists and makes calls to conceptual Supabase RPC functions (e.g., `get_daily_sales_trend`). These RPCs and underlying analytics data collection mechanisms need to be fully implemented in Supabase by a human developer.
            *   `SettingsService.ts`: Currently mocked. Assumes an `app_settings` table in Supabase for storing key-value application settings. Backend CRUD for this table needs implementation.
            *   `ChangelogService.ts`: Currently mocked. Assumes a `changelog_entries` table in Supabase. Backend CRUD for this table needs implementation.
*   **Mock Supabase Client:**
    *   `src/lib/supabase.ts` can initialize either a real Supabase client or a comprehensive mock client.
    *   The mock client is used if `VITE_DEBUG=true` (in `.env`) or if Supabase URL/Anon key are missing or are the default demo ones. This is useful for isolated frontend development or testing without live backend.

## 3. External API Integrations

*   **GSMArena API (`src/services/phoneModelService.ts`):**
    *   Fetches phone model data from the GSMArena API, proxied via `/gsmarena-api` (configured in `vite.config.ts` to point to `https://gsmarena-api.vercel.app`).
    *   Includes error handling and basic fallbacks. Consider caching for performance.
*   **Smartprix Scraping (`src/services/smartprixService.ts`):**
    *   Scrapes phone data from Smartprix.com using Axios and Cheerio.
    *   **Warning:** Web scraping is inherently fragile and may break if Smartprix changes its website structure. This service requires regular monitoring and potential updates to selectors.
    *   Consider official APIs as a more reliable long-term solution if available.

## 4. State Management

*   **React Context API** is the primary method for global state:
    *   `src/context/AppContext.tsx`: Manages global state for the public-facing application, including the shopping cart (persisted to localStorage), wishlist (persisted to localStorage), product search state (query, filters, results), and fetched categories.
    *   `src/context/AuthContext.tsx`: Manages user authentication state (current user, session, loading/error states), and provides authentication methods (login, logout, signUp). Also includes `hasPermission` logic (currently basic, relies on permissions being populated on the user object).
    *   `src/context/AdminContext.tsx`: Manages global state for the admin panel, such as the current admin user, a list of all products for admin views, and potentially other admin-specific global data.

## 5. Key Architectural Decisions & Conventions

*   **Service-Oriented Data Access:** All interactions with Supabase or external APIs should be encapsulated within service classes in `src/services/`. UI components should call these services.
*   **Environment Variables:**
    *   All API keys, Supabase credentials, and other configurations are managed via `.env` files.
    *   Client-side accessible variables **must** be prefixed with `VITE_` (e.g., `VITE_SUPABASE_URL`).
    *   **Critical Security Note for KNET:** The `KNET_RESOURCE_KEY` (the actual KNET secret key for HMAC signature verification) **MUST NOT** be exposed as a `VITE_` variable or stored in client-side code. It is a server-side secret only. The client-side `knet.ts` utility has been updated to reflect this.
*   **Type Safety:** The project uses TypeScript. Main application types are in `src/types/`. Database-specific types are generated by Supabase or defined in `src/lib/supabase.ts`.
*   **Styling:** Tailwind CSS is the utility-first CSS framework. Customizations and theme extensions are in `tailwind.config.js`. Global styles are minimal in `src/index.css`.
*   **Routing:** `react-router-dom` is used for all client-side routing. See `src/App.tsx` for route definitions.
*   **KNET Payment Flow:**
    *   The client-side part of generating KNET payment requests is in `src/utils/knet.ts`.
    *   `PaymentSuccessPage.tsx` and `PaymentErrorPage.tsx` handle callbacks.
    *   **MANDATORY SERVER-SIDE VERIFICATION:** The `knetService.verifyPaymentResponse` in `src/utils/knet.ts` performs only preliminary client-side checks. **Secure HMAC signature verification using the KNET Secret Key MUST be implemented on a backend server endpoint.** The `PaymentSuccessPage.tsx` should call this backend endpoint to confirm payment before finalizing an order.
*   **Image Optimization:** `src/utils/imageOptimization.ts` provides an `ImageOptimizer` (for Cloudinary) and `ImgBBUploader`. These use `VITE_` environment variables for configuration.

## 6. Development Workflow Notes

*   **Run Development Server:** `npm run dev`
*   **Build for Production:** `npm run build`
*   **Linting:** `npm run lint`
*   **Testing:** `npm run test` (uses Vitest, currently has example tests). `npm run coverage` for coverage.
*   **Daily Progress Report:** `node scripts/daily-report.js` (requires Node.js environment).
*   **VPS Deployment:** `scripts/deploy-vps.sh` provides a comprehensive script for deploying to a Linux VPS with Nginx. (Note: PM2 section for a custom API is currently commented out as no such API exists in this primarily frontend/Supabase project).

## 7. Areas Under Development / Key TODOs for AI Agents or Developers

*   **Backend for Services:**
    *   `AnalyticsService.ts`: Implement the conceptual Supabase RPC functions (e.g., `get_daily_sales_trend`, `get_sales_by_category`) and underlying data collection mechanisms.
    *   `SettingsService.ts`: Create the `app_settings` table in Supabase and implement the service's CRUD methods to use it.
    *   `ChangelogService.ts`: Create the `changelog_entries` table in Supabase and implement the service's CRUD methods.
*   **KNET Server-Side Verification:** Implement the backend endpoint for secure KNET payment response verification. Update `PaymentSuccessPage.tsx` to call this endpoint.
*   **Admin User Creation:** Define and implement a secure flow for creating the initial super_admin/admin user (e.g., a setup script, or clear manual Supabase instructions).
*   **Permissions:** Fully implement the permission population logic in `AuthContext` (populating `state.user.permissions` based on role from `AuthService`).
*   **Test Coverage:** Significantly expand unit, integration, and potentially E2E test coverage.
*   **UI Enhancements:** Implement actual charting in analytics pages (currently placeholders).
*   **Error Handling:** Continue to refine user-facing error messages and handling for API/network issues.
*   **Pagination Total Counts:** Ensure services like `ProductService.getProducts` and `OrderService.getAllOrders` can efficiently return total counts for accurate pagination, or implement dedicated count methods.

By following these guidelines, agents can contribute more effectively to the project.
