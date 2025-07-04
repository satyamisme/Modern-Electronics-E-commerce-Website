# Modern Electronics E-commerce Website

This project is a modern e-commerce platform for electronics, featuring a comprehensive admin panel with robust security and management tools.

## Table of Contents
- [Key Features](#key-features)
- [🇰🇼 Kuwait Market Features](#kuwait-market-features)
- [Local Development Setup](#local-development-setup)
- [Running with Docker](#running-with-docker)
- [Deployment](#deployment)
- [Development Guidelines](#development-guidelines)
- [Technical Implementation](#technical-implementation)
- [Future Enhancements Roadmap](#future-enhancements-roadmap)

## Key Features

### Enhanced Security & Authentication
*   **Role-Based Access Control:**
    *   5 Admin Roles: Super Admin, Admin, Manager, Editor, Viewer.
    *   Granular Permissions: 13 different permission types for fine-grained control.
*   **Protected Routes:** All admin pages require authentication and appropriate permissions.
*   **Secure Login:** Professional login form with credential validation.
*   **Demo Credentials:**
    *   Super Admin: `admin@techstore.com` / `admin123`
    *   Manager: `manager@techstore.com` / `admin123`
    *   Editor: `editor@techstore.com` / `admin123`

### 📸 Advanced Image Upload System
*   **Dual Upload Methods:**
    *   File Upload: Drag & drop with file validation.
    *   URL Input: Direct image URL addition.
*   **Format Support:** JPEG, PNG, WebP.
*   **Size Validation:** 5MB maximum per file.
*   **Preview Management:** Visual grid with delete controls.
*   **Smart Features:**
    *   Main Image Indicator: First image automatically becomes primary.
    *   Duplicate Prevention: Prevents adding the same URL twice.
*   **Error Handling:** Clear validation messages.
*   **Responsive Design:** Works perfectly on all devices.

### 📋 Changelog Management System
*   **Comprehensive Tracking:**
    *   Version Control: Semantic versioning (Major.Minor.Patch).
    *   Change Categories: Added, Changed, Deprecated, Removed, Fixed, Security.
    *   Impact Levels: High, Medium, Low impact classification.
    *   Author Attribution: Track who made each change.
*   **Search & Filter:** Find specific updates quickly.
*   **Professional Documentation:**
    *   See `CHANGELOG.md` for the industry-standard changelog file.
    *   Development Guidelines (below): Clear versioning and documentation standards.
    *   Roadmap Planning (below): Future feature planning included.

### 🛡️ Security Features
*   **Access Control:**
    *   Permission-Based UI: Menu items only show if the user has access.
    *   Route Protection: Automatic redirection for unauthorized access.
*   **Session Management:** Secure login persistence.
*   **Role Validation:** Real-time permission checking.
*   **Data Protection:**
    *   Input Validation: Comprehensive form validation.
    *   Error Handling: Graceful error management.
    *   Secure Storage: Proper session handling.

### 🎨 User Experience Improvements
*   **Intuitive Interface:**
    *   Role Indicators: Clear role display in the header.
    *   Permission Feedback: Users only see what they can access.
*   **Professional Design:** Clean, modern admin interface.
*   **Responsive Layout:** Perfect on all screen sizes.
*   **Enhanced Product Management:**
    *   Rich Form Controls: Dynamic specifications, features, and tags.
    *   Visual Feedback: Real-time validation and status indicators.
    *   Bulk Operations: Efficient management of multiple items.
    *   Smart Defaults: Intelligent form behavior.

### 📊 Admin Dashboard Features
*   **Real-Time Analytics:**
    *   Key Metrics: Revenue, orders, products, average order value.
    *   Inventory Alerts: Low stock and out-of-stock notifications.
    *   Top Products: Best-selling items tracking.
    *   Recent Activity: Live activity feed.
*   **Operational Tools:**
    *   Order Management: Complete order lifecycle tracking.
    *   Stock Monitoring: Real-time inventory status.
    *   User Management: Role-based user administration.
    *   System Monitoring: Performance and security tracking.

---

## 🇰🇼 Kuwait Market Features
This section details features specifically implemented for the Kuwaiti market. *(Note: Some of these files may currently be missing and are planned for implementation).*

*   **Currency Utilities (Planned: `src/utils/currency.ts`):**
    *   KWD currency formatting with 3 decimal places.
    *   USD to KWD conversion functions.
    *   Kuwait-specific price validation.

*   **KNET Payment Integration (Planned: `src/utils/knet.ts`):**
    *   Complete KNET payment gateway service.
    *   Payment URL generation.
    *   Response verification.
    *   Refund processing capabilities.

*   **Kuwait-Specific Utilities (Planned: `src/utils/kuwait.ts`):**
    *   All 6 Kuwait governorates with delivery zones.
    *   Phone number validation for Kuwait (+965).
    *   Business hours and holiday management.
    *   Civil ID validation.
    *   Address formatting for Kuwait.

*   **Enhanced Components - Kuwait Specific (Planned):**
    *   **Kuwait Address Form (`src/components/ui/KuwaitAddressForm.tsx`):**
        *   Governorate and area selection.
        *   Block, street, building input.
        *   Delivery fee calculation.
        *   Arabic language support.
    *   **KNET Payment Button (`src/components/ui/KNETPaymentButton.tsx`):**
        *   Secure KNET payment processing.
        *   Payment status handling.
        *   Security information display.

*   **Payment Pages - Kuwait Specific (Planned):**
    *   **Payment Success Page (`src/pages/PaymentSuccessPage.tsx`):**
        *   Order confirmation with KWD pricing.
        *   Delivery information for Kuwait.
        *   Receipt download option.
        *   Customer support contact.
    *   **Payment Error Page (`src/pages/PaymentErrorPage.tsx`):**
        *   Comprehensive error handling.
        *   Troubleshooting tips.
        *   Alternative payment methods.
        *   Customer support integration.

*   **Updated Product Data (Kuwait Specific):**
    *   All prices to be converted to KWD using realistic exchange rates.
    *   Kuwait-specific product information to be added.
    *   Local market considerations to be applied.

**Summary of Planned Kuwait Market Features:**
*   KWD currency with 3 decimal places.
*   KNET payment gateway integration.
*   Support for all 6 Kuwait governorates with delivery zones.
*   Arabic language support preparation.
*   Local business hours and holiday management.
*   Kuwait phone number validation.
*   Civil ID validation system.

---

## Local Development Setup

This section guides you through setting up the project for local development on your machine.

### Prerequisites
- **Node.js:** Version 18.x or later is recommended. We suggest using [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) to manage Node.js versions.
- **npm:** Version 8.x or later (usually comes with Node.js).
- **Git:** For cloning the repository and version control.

### General Setup Steps

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/modern-electronics-ecommerce-website.git # Replace with actual URL
    cd modern-electronics-ecommerce-website
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```
    *If you encounter peer dependency issues, you might try `npm install --legacy-peer-deps`.*

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173` (or the port specified by Vite).

### OS-Specific Guidance

#### Windows
*   **Recommended:** Use [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install). WSL 2 provides a Linux environment directly on Windows, offering better performance and compatibility for Node.js development.
    1.  Install WSL and a Linux distribution (e.g., Ubuntu) from the Microsoft Store.
    2.  Open your WSL terminal.
    3.  Install nvm, Node.js, and Git within WSL:
        ```bash
        # Install nvm (get the latest command from nvm GitHub)
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
        # Ensure your shell profile (e.g., ~/.bashrc or ~/.zshrc) is sourced or restart your terminal
        # Example for bash:
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
        # Then run:
        source ~/.bashrc
        nvm install 18 # Or desired Node.js version
        nvm use 18
        sudo apt update && sudo apt install git -y
        ```
    4.  Follow the "General Setup Steps" above within your WSL environment.
*   **Editing on Windows with WSL:**
    *   Install [Visual Studio Code](https://code.visualstudio.com/).
    *   Install the "Remote - WSL" extension in VS Code.
    *   Open your project folder (located within WSL, e.g., `/home/username/modern-electronics-ecommerce-website`) using VS Code connected to WSL. This provides a seamless development experience.
*   **Alternative (Native Windows - Not Recommended for Best Experience):**
    *   Install Node.js directly from the [official website](https://nodejs.org/).
    *   Install Git for Windows from [git-scm.com](https://git-scm.com/download/win).
    *   Use PowerShell or Command Prompt to follow the "General Setup Steps". You might encounter path issues or differences in script execution.

#### Linux (Ubuntu, Debian, Fedora, etc.)
1.  **Install nvm and Node.js:**
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    # Ensure your shell profile (e.g., ~/.bashrc or ~/.zshrc) is sourced or restart your terminal
    # Example for bash:
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    source ~/.bashrc
    nvm install 18
    nvm use 18
    ```
2.  **Install Git:** (Usually pre-installed. If not, use your distribution's package manager, e.g., `sudo apt install git` for Debian/Ubuntu).
3.  Follow the "General Setup Steps" above.

#### macOS
1.  **Install Homebrew (if not already installed):** `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
2.  **Install nvm and Node.js:**
    ```bash
    brew install nvm
    mkdir ~/.nvm # If it doesn't exist
    # Add nvm setup to your shell profile (e.g., ~/.zshrc or ~/.bash_profile)
    # For Zsh (default on newer macOS):
    echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
    echo '[ -s "$(brew --prefix nvm)/nvm.sh" ] && \. "$(brew --prefix nvm)/nvm.sh"  # This loads nvm' >> ~/.zshrc
    echo '[ -s "$(brew --prefix nvm)/etc/bash_completion.d/nvm" ] && \. "$(brew --prefix nvm)/etc/bash_completion.d/nvm"  # This loads nvm bash_completion' >> ~/.zshrc
    source ~/.zshrc # Or your respective shell profile
    nvm install 18
    nvm use 18
    ```
3.  **Install Git:** (Usually pre-installed. If not, `brew install git`).
4.  Follow the "General Setup Steps" above.

### Editor Recommendation
*   **Visual Studio Code (VS Code):** Highly recommended due to its excellent JavaScript/TypeScript support, integrated terminal, Git integration, and vast extension marketplace.
    *   Useful extensions: ESLint, Prettier - Code formatter, Tailwind CSS IntelliSense.

---

## Running with Docker

This project includes a `Dockerfile` and `docker-compose.yml` to build and run the application in a containerized environment. This is recommended for production deployment and can also be used for a consistent development environment.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed on your system.
- [Docker Compose](https://docs.docker.com/compose/install/) installed (usually included with Docker Desktop).

### Building the Docker Image
To build the Docker image directly:
```bash
docker build -t modern-electronics-ecommerce .
```

### Running with Docker
After building the image, you can run it as a container:
```bash
docker run -p 80:80 modern-electronics-ecommerce
```
The application will be accessible at `http://localhost:80` (or just `http://localhost`).
**Note:** Binding to port 80 on your host machine might require `sudo` or administrator privileges. If port 80 is in use, choose another host port, e.g., `-p 8080:80`, and update the access URL accordingly.

### Running with Docker Compose
Using Docker Compose is often simpler:
```bash
# Might require sudo if port 80 is privileged and not already free
docker-compose up
```
To run in detached mode (in the background):
```bash
# Might require sudo
docker-compose up -d
```
The application will be accessible at `http://localhost` (as it's mapped to port 80 on the host by default in `docker-compose.yml`). To stop the services:
```bash
docker-compose down
```

---

## Deployment

This section provides conceptual guidance for deploying the application, primarily focusing on using Docker on a Virtual Private Server (VPS).

### Prerequisites for VPS
- A VPS (e.g., from DigitalOcean, Linode, AWS EC2, Google Cloud Compute Engine).
- SSH access to your VPS.
- Docker and Docker Compose installed on the VPS.

### General VPS Deployment Steps (using Docker)

1.  **Prepare your VPS:**
    *   Ensure your VPS is up-to-date: `sudo apt update && sudo apt upgrade -y` (for Debian/Ubuntu).
    *   Install Docker and Docker Compose if not already present. Follow official Docker documentation for your VPS's OS.

2.  **Get Your Code onto the VPS:**
    *   **Option A (Recommended):** Clone your Git repository directly onto the VPS.
        ```bash
        git clone https://github.com/your-username/modern-electronics-ecommerce-website.git # Replace with actual URL
        cd modern-electronics-ecommerce-website
        ```
    *   **Option B:** If you build the image locally and push it to a Docker registry (like Docker Hub, GitHub Container Registry, AWS ECR), you can then pull it on the VPS.

3.  **Build and Run the Application:**
    *   Navigate to your project directory on the VPS.
    *   Use Docker Compose to build and run the application in detached mode:
        ```bash
        docker-compose up --build -d
        ```
        The `--build` flag ensures the image is built (or rebuilt if changes exist). The `-d` flag runs it in the background.

4.  **Accessing Your Application:**
    *   With the updated `docker-compose.yml` (mapping to host port 80), your application attempts to run on port 80 of your VPS. You should try accessing it via `http://<your_vps_ip>`.
    *   **Crucial Firewall Note:** For this to be accessible from the internet, you **must** ensure that **port 80 (TCP)** is open for incoming traffic in your VPS's firewall (e.g., `ufw`, `firewalld`) AND in any cloud provider security groups (e.g., AWS EC2 Security Groups, Google Cloud Firewall Rules). If port 80 is not open, you will not be able to access the application from outside the VPS.
    *   If you are running `docker-compose up -d` and it fails due to port 80 being in use or permission issues, check that no other service (like a default web server on the VPS) is using port 80, or run the command with `sudo`.

5.  **Setting up a Reverse Proxy (Recommended for Production):**
    *   Even if your Docker container is directly mapped to port 80 on the host, for a production environment, using a dedicated reverse proxy (like Nginx or Caddy installed directly on the VPS, or as another Docker container) is **highly recommended**.
    *   **Benefits:**
        *   **SSL/TLS Termination:** Easily add HTTPS to your site (e.g., with Let's Encrypt). This is essential for security.
        *   **Domain Name:** Serve your application from a custom domain name (e.g., `www.your-ecommerce.com`) instead of an IP address and port.
        *   **Load Balancing:** (If you scale to multiple containers).
        *   **Serving Static Assets:** Can be more efficient for serving static files directly.
        *   **Easier Port Management:** Your application container can run on an internal Docker network port (e.g., the default 80 inside the container), and the reverse proxy on the VPS handles external traffic on ports 80/443 and forwards it. This avoids needing to run your application container with elevated privileges just to bind to host port 80.
    *   **Conceptual Nginx Setup (Nginx on Host, App in Docker on an internal port e.g. 8080):**
        1.  Modify `docker-compose.yml` to map ports like `ports: - "127.0.0.1:8080:80"` (making the container accessible only on localhost of the VPS at port 8080).
        2.  Install Nginx on your VPS (`sudo apt install nginx`).
        3.  Configure an Nginx server block (virtual host) on the VPS to listen on port 80 (and 443 for HTTPS). This server block would then `proxy_pass` requests to `http://localhost:8080`.
        4.  Set up SSL using Certbot with Let's Encrypt on the Nginx server block on the host.
    *   *(Detailed Nginx/Caddy setup is beyond the scope of this README but is a standard and critical practice for web application deployment.)*

6.  **Monitoring and Maintenance:**
    *   Use `docker-compose logs -f app` to view application logs.
    *   Regularly update your VPS and application dependencies.

---

## Development Guidelines

### Version Numbering
Use Semantic Versioning (Major.Minor.Patch):
-   **Major (X.0.0)**: Breaking changes, major feature releases.
-   **Minor (X.Y.0)**: New features, backwards compatible.
-   **Patch (X.Y.Z)**: Bug fixes, small improvements.

### Change Categories (for `CHANGELOG.md`)
-   **Added**: New features.
-   **Changed**: Changes in existing functionality.
-   **Deprecated**: Soon-to-be removed features.
-   **Removed**: Removed features.
-   **Fixed**: Bug fixes.
-   **Security**: Security improvements.

### Impact Levels (for `CHANGELOG.md`)
-   **High**: Affects core functionality or requires user action.
-   **Medium**: Noticeable improvements or changes.
-   **Low**: Minor improvements or fixes.

---

## 🔧 Technical Implementation
*   **Framework:** React with Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM
*   **State Management:** React Context API
*   **Linting:** ESLint
*   **Architecture:**
    *   Context-Based State: Efficient state management.
    *   Component Modularity: Reusable, maintainable components.
    *   Type Safety: Full TypeScript implementation.
*   **Performance Optimized:** Efficient rendering and data handling.
*   **Security Best Practices:**
    *   Authentication Flow: Secure login/logout process.
    *   Permission System: Granular access control.
    *   Session Security: Proper token management.
    *   Input Sanitization: Protected against common attacks.

---

## Future Enhancements Roadmap

This roadmap outlines the planned features and improvements for the platform. It integrates items previously mentioned in `developmen.md` and `CHANGELOG.md`.

### Phase 1: Implement Core Kuwait Market Features (High Priority)
-   [ ] **Currency Utilities (`src/utils/currency.ts`):**
    -   [ ] Implement KWD currency formatting (3 decimal places).
    -   [ ] Implement USD to KWD conversion functions.
    -   [ ] Implement Kuwait-specific price validation.
-   [ ] **KNET Payment Integration (`src/utils/knet.ts`):**
    -   [ ] Implement KNET payment gateway service logic.
    -   [ ] Implement payment URL generation.
    -   [ ] Implement response verification.
    -   [ ] Implement refund processing.
-   [ ] **Kuwait-Specific Utilities (`src/utils/kuwait.ts`):**
    -   [ ] Populate data for 6 Kuwait governorates & delivery zones.
    -   [ ] Implement phone number validation (+965).
    -   [ ] Implement business hours and holiday management.
    -   [ ] Implement Civil ID validation.
    -   [ ] Implement address formatting for Kuwait.
-   [ ] **Kuwait Address Form (`src/components/ui/KuwaitAddressForm.tsx`):**
    -   [ ] Implement governorate and area selection.
    -   [ ] Implement block, street, building inputs.
    -   [ ] Implement delivery fee calculation.
    -   [ ] Add Arabic language support.
-   [ ] **KNET Payment Button (`src/components/ui/KNETPaymentButton.tsx`):**
    -   [ ] Implement secure KNET payment processing.
    -   [ ] Implement payment status handling.
    -   [ ] Add security information display.
-   [ ] **Payment Success Page (`src/pages/PaymentSuccessPage.tsx`):**
    -   [ ] Display order confirmation (KWD pricing).
    -   [ ] Display delivery information for Kuwait.
    -   [ ] Implement receipt download option.
    -   [ ] Add customer support contact.
-   [ ] **Payment Error Page (`src/pages/PaymentErrorPage.tsx`):**
    -   [ ] Implement comprehensive error handling.
    -   [ ] Add troubleshooting tips.
    -   [ ] Link to alternative payment methods.
    -   [ ] Add customer support integration.
-   [ ] **Product Data Update:**
    -   [ ] Convert all product prices in mock data/backend to KWD.
    -   [ ] Add Kuwait-specific product information fields and data.
-   [ ] **Add New Payment Pages to Router:** Integrate `PaymentSuccessPage` and `PaymentErrorPage` into `App.tsx` routing.

### Phase 2: General Platform Enhancements (From original CHANGELOG.md ideas)
-   [ ] **Customer Management System:**
    -   [ ] User profiles and order history.
    -   [ ] Address book management.
-   [ ] **Advanced Analytics Dashboard:**
    -   [ ] More detailed sales reports.
    -   [ ] Customer behavior analytics.
-   [ ] **Email Notification System:**
    -   [ ] Order confirmations.
    -   [ ] Shipping updates.
    -   [ ] Promotional emails (opt-in).
-   [ ] **Bulk Product Import/Export:**
    -   [ ] CSV or Excel format support for admin panel.
-   [ ] **Advanced Search with Filters:**
    -   [ ] More granular search options (e.g., by specification, brand, dynamic facets).

### Phase 3: Further Expansion (From original CHANGELOG.md ideas)
-   [ ] **Multi-language Support:**
    -   [ ] Full Arabic language support for storefront and admin.
    -   [ ] Framework for adding other languages (i18n).
-   [ ] **Additional Payment Gateway Integrations:**
    -   [ ] Credit/Debit card processing (e.g., Stripe, Checkout.com) beyond KNET.
-   [ ] **Shipping Management:**
    -   [ ] Integration with local delivery services APIs.
    -   [ ] Real-time shipping rate calculations.
-   [ ] **Customer Reviews System:**
    -   [ ] Allow users to submit product ratings and reviews.
    -   [ ] Admin moderation tools for reviews.
-   [ ] **SEO Optimization Tools:**
    -   [ ] Meta tag management for products/categories.
    -   [ ] Sitemap generation.
    -   [ ] Structured data (JSON-LD).

### Phase 4: Long-Term Vision (From original `developmen.md` and `CHANGELOG.md`)
-   [ ] **Mobile App Development:**
    -   [ ] iOS and Android companion apps (React Native or native).
-   [ ] **AI-Powered Recommendations:**
    -   [ ] Personalized product suggestions engine.
-   [ ] **Multi-Vendor Marketplace:**
    -   [ ] Allow third-party sellers to list products.
    -   [ ] Vendor dashboards and commission system.
-   [ ] **B2B Portal:**
    -   [ ] Features for business customers (bulk ordering, custom pricing).
-   [ ] **GCC Market Expansion:**
    -   [ ] Support for other Gulf Cooperation Council countries (currencies, shipping, regulations).
-   [ ] **Advanced Reporting & Business Intelligence:**
    -   [ ] Customizable reports and data visualization tools.
-   [ ] **API for Third-Party Integrations:**
    -   [ ] Public or partner API for external systems to connect.

---

The admin panel provides enterprise-level functionality with professional security, comprehensive product management, and detailed change tracking. All features are designed to be user-friendly while maintaining robust security and scalability. This README will be updated as development progresses.
