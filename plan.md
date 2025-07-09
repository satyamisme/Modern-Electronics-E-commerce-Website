# Plan to Finalize LAKKI PHONES Project

This document outlines the plan to address unfinished implementations, potential bugs, and areas for improvement in the LAKKI PHONES e-commerce platform.

## I. Complete Backend Integration & Remove Mocks

This is the highest priority set of tasks to make the application fully functional.

1.  **Implement Full Authentication System (Supabase)**
    *   **Task:** Modify `src/lib/supabase.ts` to ensure the real Supabase client is used reliably based on environment (e.g., `VITE_NODE_ENV !== 'development'` or similar).
    *   **Task:** Refactor `src/hooks/useSupabase.ts` to:
        *   Initialize Supabase client.
        *   Implement `onAuthStateChange` listener to set real user state.
        *   Implement actual `signUp`, `signIn`, `signOut`, `resetPassword` functions interacting with `supabase.auth`.
    *   **Task:** Implement all methods in `src/services/authService.ts` to interact with Supabase for user profiles, roles, and potentially permissions. This includes:
        *   Fetching user profiles (e.g., `getCurrentProfile`, `getUsers`).
        *   Updating user profiles and roles.
    *   **Task:** Refactor `src/context/AuthContext.tsx`:
        *   Remove hardcoded demo logins.
        *   Integrate with the fully implemented `useSupabase` hook and `AuthService`.
        *   Implement `hasPermission(permission: Permission): boolean` logic based on the user's role and permissions fetched from `authService` or user object.
    *   **Files to Review/Modify:** `src/lib/supabase.ts`, `src/hooks/useSupabase.ts`, `src/services/authService.ts`, `src/context/AuthContext.tsx`, all admin pages using `ProtectedRoute`.

2.  **Implement Product Management Backend (Supabase)**
    *   **Task:** Refactor `src/services/productService.ts` to perform CRUD operations against Supabase tables (`products`, `categories`, `product_images`).
        *   Remove reliance on `src/data/products.ts`.
        *   Implement `getProducts`, `getProduct`, `createProduct`, `updateProduct`, `deleteProduct`.
        *   Implement `getCategories`, `searchProducts`, `getFeaturedProducts`, `getBestSellers`.
        *   Implement `addProductImages`, `updateProductImages`.
        *   Implement `updateProductRating`.
    *   **Task:** Update data fetching in relevant pages/contexts:
        *   `src/pages/ProductDetailPage.tsx`: Fetch product data via `ProductService`.
        *   `src/pages/HomePage.tsx`, `src/pages/CategoriesPage.tsx`: Fetch category data via `ProductService`.
        *   `src/context/AppContext.tsx`: Load initial products via `ProductService`.
        *   `src/pages/admin/AdminProducts.tsx`: Ensure it uses the updated `ProductService` for all operations.
    *   **Files to Review/Modify:** `src/services/productService.ts`, `src/data/products.ts` (for removal/archival), `src/pages/ProductDetailPage.tsx`, `src/pages/HomePage.tsx`, `src/pages/CategoriesPage.tsx`, `src/context/AppContext.tsx`, `src/pages/admin/AdminProducts.tsx`, `src/components/admin/ProductForm.tsx`.

3.  **Implement Analytics Service (Supabase or Dedicated Service)**
    *   **Task:** Design Supabase tables or integrate a third-party analytics service for collecting relevant data (page views, sales, user actions, search queries).
    *   **Task:** Refactor `src/services/analyticsService.ts` to query and process data from the chosen backend. Remove mock data generation.
    *   **Task:** Update `src/pages/admin/AdminDashboard.tsx` and `src/pages/admin/AdminAnalytics.tsx` to consume real data from `analyticsService`.
    *   **Files to Review/Modify:** `src/services/analyticsService.ts`, `src/pages/admin/AdminDashboard.tsx`, `src/pages/admin/AdminAnalytics.tsx`, potentially new Supabase migration files.

4.  **Implement User Management in Admin Panel (Supabase)**
    *   **Task:** Refactor `src/pages/admin/AdminUsers.tsx` to use the (now unmocked) `AuthService` or a dedicated user management service to:
        *   Fetch the list of users.
        *   Perform CRUD operations on users (view details, update role/status, delete - ensure proper authorization).
    *   **Files to Review/Modify:** `src/pages/admin/AdminUsers.tsx`, `src/services/authService.ts`.

5.  **Integrate Real Order Data in Admin Panel**
    *   **Task:** Refactor `src/pages/admin/AdminOrders.tsx` to fetch and display real order data using `OrderService.getAllOrders()` and `OrderService.getOrderStats()`. Remove mock order initialization.
    *   **Files to Review/Modify:** `src/pages/admin/AdminOrders.tsx`, `src/services/orderService.ts`.

6.  **Implement Missing Admin Features**
    *   **Task:** Develop the UI and backend logic for `src/pages/admin/AdminSettings.tsx`.
    *   **Task:** Implement functionality to add new entries in `src/pages/admin/AdminChangelog.tsx` (requires backend storage for changelog entries).
    *   **Files to Review/Modify:** `src/pages/admin/AdminSettings.tsx`, `src/pages/admin/AdminChangelog.tsx`, potentially new service files and Supabase tables.

## II. Address Potential Bugs & Areas for Improvement

1.  **Standardize Data Sources:**
    *   **Task:** Ensure all product and category data is consistently fetched through `ProductService` across the application. Remove direct imports from `src/data/products.ts` in components/pages.
2.  **Enhance KNET Payment Integration:**
    *   **Task:** Implement robust signature verification for KNET payment responses in `src/utils/knet.ts`.
    *   **Task:** Update KNET payment URL generation to use the actual KNET gateway endpoint (configurable via environment variables).
    *   **Task:** Review and confirm KNET amount conversion (to fils) and currency codes.
    *   **Files to Review/Modify:** `src/utils/knet.ts`.
3.  **Improve Error Handling & UI Feedback:**
    *   **Task:** Implement comprehensive error handling for all API calls (Supabase, external services) and display user-friendly error messages or fallbacks.
    *   **Task:** Add loading indicators for all asynchronous operations.
4.  **Review and Secure Environment Variables:**
    *   **Task:** Audit all environment variables (`VITE_...`). Ensure that any sensitive keys (e.g., KNET resource key if secret, Supabase service role key if ever used client-side by mistake) are not exposed directly in client-side code. Backend operations requiring such keys should be proxied through an API layer if necessary.
5.  **Refactor Hardcoded Values:**
    *   **Task:** Move hardcoded admin credentials from `AuthContext` to environment variables or a secure configuration method.
    *   **Task:** Make preview links in `scripts/daily-report.js` configurable.
    *   **Task:** Make KNET default shipping cost in `OrderService` configurable (e.g., via admin settings or environment variable).
6.  **Refine VPS Deployment Script (`deploy-vps.sh`):**
    *   **Task:** Clarify or implement the `npm run start:api` script if a separate backend process is intended.
    *   **Task:** Ensure `nginx.conf` is included in the repository and its path is correct in the script.
7.  **Strengthen External API Integrations:**
    *   **Task:** For `SmartprixService`, implement more robust error handling and potentially a caching layer, as scraping can be unreliable. Consider user-agent rotation or other best practices if facing blocks.
    *   **Task:** For `PhoneModelService`, enhance error handling and consider more sophisticated caching for GSMArena API responses.
8.  **Implement Automated Testing:**
    *   **Task:** Introduce a testing framework (e.g., Vitest, React Testing Library, Cypress).
    *   **Task:** Write unit tests for utility functions, service methods (can use mock Supabase client for testing services), and complex components.
    *   **Task:** Write integration tests for key user flows (e.g., add to cart, checkout, admin login).
    *   **Task:** Update `npm test` script to run actual tests.
9.  **Image Optimization Configuration:**
    *   **Task:** Ensure Cloudinary/ImgBB accounts are properly configured with valid API keys in the deployed environments.
10. **Code Quality and Consistency:**
    *   **Task:** Conduct a general code review for consistency, potential race conditions (especially with async operations in `useEffect`), and adherence to React best practices.
    *   **Task:** Evaluate complex components like `ProductsPage.tsx` for potential refactoring of state logic into custom hooks or more optimized solutions.

## III. Documentation and Cleanup

1.  **Update README.md:** Reflect the current state of the project after implementing changes, especially regarding backend setup and real data sources.
2.  **Code Comments:** Add/update comments where logic is complex or non-obvious.
3.  **Remove Mock Data Files:** Once `ProductService` and other services are fully integrated, archive or remove `src/data/products.ts` and other mock initializations.
4.  **AGENTS.md:** Consider creating an `AGENTS.md` if there are specific instructions for AI agents working on this codebase in the future.

This plan provides a structured approach to transitioning the project from its current heavily mocked state to a fully functional, production-ready application. Each major task can be broken down further into sub-tasks.
