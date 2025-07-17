# LAKKI PHONES - Premium Electronics E-commerce Platform

A modern, full-featured e-commerce platform built with React, TypeScript, and Tailwind CSS, specifically optimized for the Kuwait market with KWD currency and KNET payment integration. This guide provides instructions for setting up and running the application on a VPS.

## 🚀 VPS Deployment Guide

### Quick Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/lakki-phones.git
cd lakki-phones
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your actual values
```

4. **Make server scripts executable**
```bash
chmod +x start_server.sh stop_server.sh
```

5. **Start the development server**
```bash
./start_server.sh
```

6. **Access the application**
```
http://your-vps-ip:5173
```

7. **Stop the server when needed**
```bash
./stop_server.sh
```

### Domain Configuration

#### Option 1: Freenom (Free Domain)
1. Register at [Freenom](https://www.freenom.com)
2. Register a free domain (e.g., lakkiphones.work.gd)
3. Set up DNS records:
   - Type: A
   - Name: @
   - Value: Your VPS IP (62.171.128.156)
   - TTL: 3600
4. Add another record for www subdomain:
   - Type: A
   - Name: www
   - Value: Your VPS IP (62.171.128.156)
   - TTL: 3600

#### Option 2: No-IP (Free Dynamic DNS)
1. Register at [No-IP](https://www.noip.com)
2. Create a free hostname (e.g., lakkiphones.ddns.net)
3. Point it to your VPS IP (62.171.128.156)

### VPS Server Setup

1. **Update system packages**
```bash
sudo apt update && sudo apt upgrade -y
```

2. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install Nginx (for production)**
```bash
sudo apt install nginx -y
```

4. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/lakkiphones
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name lakkiphones.work.gd www.lakkiphones.work.gd;
    
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Enable the site and restart Nginx**
```bash
sudo ln -s /etc/nginx/sites-available/lakkiphones /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **Configure firewall**
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw allow 5173
sudo ufw enable
```

### Running with Start/Stop Scripts

To run the development server and make it accessible on your network (e.g., from your VPS's IP address), use the provided scripts:

**Start the server:**
```bash
./start_server.sh
```
This will:
- Start the Vite development server.
- Make it listen on all available network interfaces (`0.0.0.0`).
- Run it in the background using `nohup`.
- Store the server's process ID (PID) in `server.pid`.
- Redirect server output (stdout and stderr) to `server.log`.
You should then be able to access the application at `http://<your-server-ip>:5173` (or the port configured in `vite.config.js`).

**Stop the server:**
```bash
./stop_server.sh
```
This will:
- Read the PID from `server.pid`.
- Stop the server process.
- Remove the `server.pid` file.

### Production Deployment

For production deployment:

1. **Build the application**
```bash
npm run build
```

2. **Copy build files to Nginx**
```bash
sudo cp -r dist/* /var/www/html/
```

3. **Update Nginx configuration**
```nginx
server {
    listen 80;
    server_name lakkiphones.work.gd www.lakkiphones.work.gd;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

4. **Restart Nginx**
```bash
sudo systemctl restart nginx
```

## 🚀 Quick Start for VPS Deployment

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Modern-Electronics-E-commerce-Website.git
cd Modern-Electronics-E-commerce-Website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
nano .env  # Edit with your settings
```

### 4. Start the Application
```bash
chmod +x scripts/start_server.sh scripts/stop_server.sh
./scripts/start_server.sh
```

### 5. Access the Application
- **Development**: http://your-vps-ip:5173
- **Admin Panel**: http://your-vps-ip:5173/admin

### 6. Admin Login Credentials
- **Email**: admin@lakkiphones.com
- **Password**: admin123

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Development Timeline](#development-timeline)
- [Installation & Setup](#installation--setup)
- [Domain & IP Configuration](#domain--ip-configuration)
- [User Registration & Admin Setup](#user-registration--admin-setup)
- [Kuwait Market Optimization](#kuwait-market-optimization)
- [Future Enhancements](#future-enhancements)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Customer Features
- **Product Discovery**: Advanced search with filters, categories, and real-time stock updates
- **Product Presentation**: High-resolution image galleries, detailed specifications, customer reviews
- **Shopping Experience**: Persistent cart, wishlist, product comparison (up to 4 items)
- **Responsive Design**: Optimized for mobile, tablet, and desktop (320px - 1440px+)
- **Kuwait Localization**: KWD currency, Arabic language support, local payment methods

### Admin Features
- **Role-Based Access Control**: Super Admin, Admin, Manager, Editor, Viewer roles
- **Product Management**: CRUD operations with drag & drop image upload
- **Order Management**: Real-time order tracking and status updates
- **Inventory Management**: Low stock alerts and automated notifications
- **Analytics Dashboard**: Dynamic dashboard with widgets for sales overview, top products, user activity, and order status summaries, all powered by a (conceptual) analytics service.
- **Changelog System**: View and manage a versioned changelog in the admin panel.
- **Application Settings**: View and manage site-wide settings from the admin panel.
- **User Management**: Admins can view, search, filter, and now **create and edit** users via a form modal.

### Security Features
- **Authentication**: JWT-based session management with role validation via Supabase.
- **Protected Routes**: Robust, permission-based access control for all admin panel sections.
- **Secure File Upload**: Image validation and size limits.
- **Input Validation**: Comprehensive form validation and sanitization.

## 📈 Current Status (As of July 2024)

The project has been significantly developed from a mock-up to a functional and stable **client-side application**. The frontend is now largely complete and is ready for the backend implementation.

- ✅ **Client-Side Complete**: All major UI components and pages are built. All services are defined and integrated. All mock data has been removed in favor of service calls.
- ✅ **Builds Successfully**: The project has a stable, successful build with no critical errors.
- ✅ **Code Quality**: A major cleanup pass has been completed, resolving all build-blocking bugs, unused variables, and many other linting issues.
- 🟡 **Backend Dependent**: The application is now waiting for a developer to implement the required Supabase database tables and RPC (Remote Procedure Call) functions that the client-side services are designed to call.

In short, the frontend is feature-complete and robust, pending backend hookup.

## 🛠 Technology Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icon library

### Build Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Deployment
- **Netlify** - Static site hosting with CDN
- **GitHub** - Version control and CI/CD

## ⏱ Development Timeline

**Total Development Time: 13 weeks (3 months)** ✅

### Phase 1: Planning & Design (2 weeks)
- Requirements analysis and system architecture
- UI/UX design and wireframing
- Database schema design
- Technology stack selection

### Phase 2: Core Development (8 weeks)
- **Week 1-2**: Project setup, routing, and basic components
- **Week 3-4**: Product catalog and search functionality
- **Week 5-6**: Shopping cart and user authentication
- **Week 7-8**: Admin panel and role management

### Phase 3: Advanced Features (2 weeks)
- **Week 9**: Image upload system and product management
- **Week 10**: Analytics dashboard and reporting

### Phase 4: Kuwait Optimization (1 week)
- **Week 11**: KWD currency integration and KNET payment setup
- Arabic language support and RTL layout
- Local market customizations

### Phase 5: Testing & Deployment (1 week)
- **Week 12**: Comprehensive testing and bug fixes
- Performance optimization
- Security audit and deployment

## 🚀 Installation & Setup


### Running with Start/Stop Scripts (for VPS)

To run the development server and make it accessible on your network (e.g., from your VPS's IP address), use the provided scripts:

**Start the server:**
```bash
./start_server.sh
```

This will start the Vite development server in the background, making it accessible at:
- `http://your-vps-ip:5173`
- `http://your-domain.com` (if DNS is configured)

**Stop the server:**
```bash
./stop_server.sh
```

### Domain Configuration

1. Log in to your domain provider (work.gd)
2. Navigate to DNS management
3. Add an A record pointing to your VPS IP:
   - Host: `@` (or subdomain)
   - Points to: Your VPS IP (`62.171.128.156`)
   - TTL: Default (or 3600)
4. Add a CNAME record for www:
### Free Domain Options

#### 1. **Freenom** (Recommended)
- **Free domains**: .tk, .ml, .ga, .cf, .gd
- **Example**: lakkiphones.work.gd
- **Setup**: Register at freenom.com
- **DNS**: Free DNS management included

#### 2. **No-IP** 
- **Free subdomain**: yourname.ddns.net
- **Example**: lakkiphones.ddns.net
- **Dynamic DNS**: Perfect for VPS

#### 3. **DuckDNS**
- **Free subdomain**: yourname.duckdns.org
- **Example**: lakkiphones.duckdns.org
- **Simple setup**: Just email registration

### VPS Configuration

```nginx
# Nginx configuration for VPS
server {
    listen 80;
    server_name lakkiphones.work.gd www.lakkiphones.work.gd;
    
    # Large file uploads
    client_max_body_size 100M;
    
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Large image handling
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
    
    # Static file caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Environment Variables for VPS

```env
# .env file
VITE_APP_NAME=LAKKI PHONES
VITE_APP_URL=http://lakkiphones.work.gd
VITE_API_URL=http://lakkiphones.work.gd/api

# Free Domain Options:
# Option 1: Freenom - lakkiphones.work.gd
# Option 2: No-IP - lakkiphones.ddns.net  
# Option 3: DuckDNS - lakkiphones.duckdns.org

# Image Hosting (Choose one)

# Option 1: Cloudinary (Recommended - 25GB free)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_API_KEY=your-api-key
VITE_CLOUDINARY_UPLOAD_PRESET=unsigned

# Option 2: ImgBB (Simple, unlimited)
VITE_IMGBB_API_KEY=your-imgbb-api-key

# Option 3: GitHub Pages (For static images)
VITE_GITHUB_IMAGES_URL=https://yourusername.github.io/lakki-images

# KNET Payment Gateway (Kuwait)
VITE_KNET_GATEWAY_URL=https://knet-test-gateway.com.kw/kpg/paymentpage.htm # Replace with actual KNET Test or Production Gateway URL
VITE_KNET_MERCHANT_ID=your_knet_merchant_id
VITE_KNET_TERMINAL_ID=your_knet_terminal_id
# VITE_KNET_RESOURCE_KEY=DO_NOT_STORE_SECRET_KEY_HERE_FOR_CLIENT_USE # CRITICAL: This is the KNET Secret Key for HMAC signature verification.
# It MUST be stored securely on your backend server and NEVER exposed in client-side code or VITE_ env variables.
# The client-side `knet.ts` uses a placeholder for this if it's read from env, emphasizing server-side verification.
VITE_KNET_RETURN_URL=http://your-domain.com/payment/success # Replace with your actual domain
VITE_KNET_ERROR_URL=http://your-domain.com/payment/error   # Replace with your actual domain

# Supabase Database
VITE_SUPABASE_URL=your_supabase_project_url # e.g., https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Analytics (Optional - Example: Google Analytics)
VITE_GA_TRACKING_ID=your_ga_tracking_id

# Email Service (Optional - Example: For contact forms or notifications if handled client-side)
VITE_EMAIL_SERVICE_ID=your_email_service_id

# Development Settings
VITE_DEBUG=true # Set to true to enable mock Supabase client and other debug features during development
VITE_FORCE_MOCK_CLIENT=false # Set to true to force mock Supabase client even if credentials are provided (for testing)
VITE_LOG_LEVEL=info

# VPS Configuration (Informational - for server setup scripts, not directly used by Vite app)
SERVER_IP=your_vps_ip
DOMAIN=your-domain.com
SSL_ENABLED=false
```

**Important Notes on Environment Variables:**
- Variables prefixed with `VITE_` are embedded into the client-side bundle. **Never put private secret keys here if they are used for sensitive operations that should only occur on a server.**
- The `KNET_RESOURCE_KEY` (the actual KNET secret key) must be stored securely on your backend server that handles payment verification. It should NOT be set as `VITE_KNET_RESOURCE_KEY` for client-side access for verification purposes.
- For production builds, set `VITE_DEBUG=false` and `VITE_FORCE_MOCK_CLIENT=false`.

### Supabase Backend Setup
This project uses Supabase for its backend database and authentication.
1.  **Create a Supabase Project:** Go to [supabase.com](https://supabase.com) and create a new project.
2.  **Database Migrations:** Apply the database schema by running the migrations located in the `supabase/migrations` directory of this repository. You can use the Supabase CLI:
    ```bash
    supabase link --project-ref your-project-id
    supabase db push
    ```
    Alternatively, you can execute the SQL files manually in the Supabase SQL Editor.
3.  **Obtain Credentials:** From your Supabase project settings, find the Project URL and the `anon` public key.
4.  **Configure Environment:** Update your `.env` file (copied from `.env.example`) with:
    *   `VITE_SUPABASE_URL`
    *   `VITE_SUPABASE_ANON_KEY`
5.  **Authentication Settings:** Configure authentication providers (e.g., email/password, social logins) in the Supabase Dashboard under Authentication. Ensure "Enable Email Confirmations" is set as desired.

### KNET Payment Gateway Setup
1.  Obtain test/production credentials from KNET for your merchant account: Merchant ID, Terminal ID, and the Secret Resource Key.
2.  Configure `VITE_KNET_GATEWAY_URL`, `VITE_KNET_MERCHANT_ID`, `VITE_KNET_TERMINAL_ID`, `VITE_KNET_RETURN_URL`, and `VITE_KNET_ERROR_URL` in your `.env` file.
3.  **Crucially, implement a server-side backend endpoint (e.g., a Supabase Edge Function) to securely verify KNET payment responses.** This endpoint will use your KNET Secret Resource Key (stored as a server-only environment variable) to validate the HMAC signature of the KNET response. The client-side application should call this backend endpoint after receiving the KNET callback. **Do not perform final signature verification on the client-side.**

## 👥 User Registration & Admin Setup

### Customer Registration Flow
Users can sign up for an account through the application. Email verification may be required based on your Supabase auth settings.

### Admin User Setup
1.  **Initial Admin User:** After setting up Supabase, the first admin user (e.g., with `super_admin` role) needs to be created. This can be done by:
    *   Signing up a new user through the application.
    *   Manually updating their role to `super_admin` in the `profiles` table in your Supabase database.
    *   Ensure the corresponding user exists in the `auth.users` table.
2.  **Further Admin Management:** Once a super_admin can log in, other admin users with different roles can be managed via the "Users" section in the Admin Panel (role updates).

#### Admin Role Hierarchy (Example - can be configured in `AuthService` permission logic)

1. **Super Admin** - Full system access
   - User management
   - System settings
   - All CRUD operations
   - Analytics and reports

2. **Admin** - Store management
   - Product management
   - Order processing
   - Customer support
   - Limited user management

3. **Manager** - Operations oversight
   - Inventory management
   - Order fulfillment
   - Basic analytics
   - Staff coordination

4. **Editor** - Content management
   - Product information updates
   - Content creation
   - Basic order viewing

5. **Viewer** - Read-only access
   - View products and orders
   - Generate reports
   - No modification rights

(Details of roles and their permissions are managed within the application logic, primarily in `src/services/authService.ts` and checked by `src/context/AuthContext.tsx` and `src/components/admin/ProtectedRoute.tsx`).

## 🇰🇼 Kuwait Market Optimization

The application is fully optimized for the Kuwait market with:

- KWD currency with 3 decimal places
- KNET payment gateway integration
- Arabic language support
- Kuwait address system with governorates
- Local phone number validation
- Kuwait-specific business features

See the [Kuwait Currency Display Guide](docs/CURRENCY_GUIDE.md) for more details.

## 🔮 Future Enhancements

### Phase 1: Enhanced User Experience (Q2 2024)
- [ ] **Mobile App Development**
  - React Native iOS/Android apps
  - Push notifications for order updates
  - Offline browsing capability
  - Biometric authentication

- [ ] **Advanced Search & AI**
  - Voice search integration
  - Visual search (image-based product search)
  - AI-powered product recommendations
  - Chatbot customer support

- [ ] **Social Commerce**
  - Social media login integration
  - Share products on social platforms
  - User-generated content (reviews with photos/videos)
  - Influencer collaboration tools

### Phase 2: Business Intelligence (Q3 2024)
- [ ] **Advanced Analytics**
  - Customer behavior tracking
  - Predictive analytics for inventory
  - Sales forecasting
  - A/B testing framework

- [ ] **Marketing Automation**
  - Email marketing campaigns
  - SMS notifications (Kuwait numbers)
  - Abandoned cart recovery
  - Loyalty program integration

- [ ] **Inventory Management**
  - Automated reordering
  - Supplier integration
  - Multi-warehouse support
  - Barcode scanning

### Phase 3: Marketplace Features (Q4 2024)
- [ ] **Multi-Vendor Platform**
  - Vendor registration and management
  - Commission-based pricing
  - Vendor analytics dashboard
  - Quality control system

- [ ] **Advanced Payment Options**
  - Installment plans (Tabby, Tamara)
  - Cryptocurrency payments
  - Buy now, pay later options
  - Corporate billing accounts

- [ ] **International Expansion**
  - GCC market expansion
  - Multi-currency support
  - International shipping
  - Localization for other markets

### Phase 4: Enterprise Features (Q1 2025)
- [ ] **B2B Portal**
  - Bulk ordering system
  - Corporate accounts
  - Custom pricing tiers
  - Purchase order integration

- [ ] **Advanced Security**
  - Two-factor authentication
  - Fraud detection system
  - GDPR compliance
  - Regular security audits

- [ ] **Performance Optimization**
  - Progressive Web App (PWA)
  - Server-side rendering (SSR)
  - Edge computing integration
  - Advanced caching strategies

### Technical Roadmap

#### Backend Development
- [ ] **Database Migration**
  - PostgreSQL/MongoDB implementation
  - Real-time data synchronization
  - Backup and disaster recovery
  - Performance optimization

- [ ] **API Development**
  - RESTful API with GraphQL
  - Rate limiting and security
  - Third-party integrations
  - Webhook support

- [ ] **DevOps & Infrastructure**
  - Kubernetes deployment
  - CI/CD pipeline automation
  - Monitoring and logging
  - Load balancing

#### Integration Priorities
1. **Payment Gateways**: KNET, Visa, Mastercard
2. **Shipping Partners**: Aramex, DHL, local couriers
3. **ERP Systems**: SAP, Oracle integration
4. **Marketing Tools**: Google Analytics, Facebook Pixel
5. **Customer Support**: Zendesk, Intercom

## 📚 Backend Interaction

The application interacts with a Supabase backend using the Supabase client library. Key data operations for entities like Products, Orders, Authentication, etc., are encapsulated within services found in `src/services/`.
Refer to the Supabase table definitions (conceptually in `src/lib/supabase.ts` and physically in your Supabase project schema) and Supabase's own documentation for table structures and API details.

## 🤝 Contributing

### Development Guidelines

1. **Code Style**
   - Use TypeScript for type safety
   - Follow ESLint configuration
   - Use Prettier for code formatting
   - Write meaningful commit messages

2. **Branch Strategy**
   ```bash
   main          # Production branch
   develop       # Development branch
   feature/*     # Feature branches
   hotfix/*      # Emergency fixes
   release/*     # Release preparation
   ```

3. **Pull Request Process**
   - Create feature branch from develop
   - Write comprehensive tests
   - Update documentation
   - Request code review
   - Merge after approval

### Testing Strategy

```bash
# Run unit and component tests
npm run test

# Run tests with coverage report
npm run coverage
```
(Assumes Vitest setup. Further E2E/integration test scripts can be added as needed.)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

- **Technical Support**: support@lakkiphones.com
- **Business Inquiries**: support@lakkiphones.com
- **Customer Service**: 50430606 / 55463597 (محل تلفون لكي,خيطان مجمع فهد الدبوس علي كل التلفونات والاكسسوارت عرض)
- **Address**: muscat street, opp gulf bank, khaitan, Kuwait, Khaitan, Al 'Āşimah, Kuwait 83000
- **Website**: www.lakkiphones.com

---

**Built with ❤️ for the Kuwait market by LAKKI PHONES**

*Last updated: July 2024*