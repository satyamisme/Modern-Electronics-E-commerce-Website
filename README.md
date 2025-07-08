# LAKKI PHONES - Premium Electronics E-commerce Platform

A modern, full-featured e-commerce platform built with React, TypeScript, and Tailwind CSS, specifically optimized for the Kuwait market with KWD currency and KNET payment integration. This guide provides instructions for setting up and running the application on a VPS.

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
- **Analytics Dashboard**: Sales metrics, top products, revenue tracking
- **Changelog System**: Track all system updates and changes

### Security Features
- **Authentication**: JWT-based session management with role validation
- **Protected Routes**: Permission-based access control
- **Secure File Upload**: Image validation and size limits
- **Input Validation**: Comprehensive form validation and sanitization

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

### VPS Prerequisites
- Node.js 18+ and npm
- Git
- Modern web browser
- Linux VPS (Ubuntu/Debian recommended)

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/satyamisme/Modern-Electronics-E-commerce-Website.git
cd Modern-Electronics-E-commerce-Website
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Admin Panel: http://localhost:5173/admin

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

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
   - Host: `www`
   - Points to: `lakkiphones.work.gd`
   - TTL: Default (or 3600)

### Environment Variables

Create a `.env` file in the root directory:

```env
# Application Settings
VITE_APP_NAME=LAKKI PHONES
VITE_APP_URL=https://www.lakkiphones.com
VITE_API_URL=https://api.lakkiphones.com

# Payment Gateway (KNET)
VITE_KNET_MERCHANT_ID=your_merchant_id
VITE_KNET_TERMINAL_ID=your_terminal_id
VITE_KNET_RESOURCE_KEY=your_resource_key

# Analytics
VITE_GA_TRACKING_ID=your_ga_tracking_id

# Email Service
VITE_EMAIL_SERVICE_ID=your_email_service_id
```

## 🌐 Nginx Configuration (Optional)

If you want to use Nginx as a reverse proxy:

1. Install Nginx:
```bash
sudo apt update
sudo apt install nginx
```

2. Copy the provided configuration:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/lakkiphones
```

3. Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/lakkiphones /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. Configure firewall:
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

## 👥 User Registration & Admin Setup

### Customer Registration Flow

1. **Self Registration**
   - Navigate to `/register`
   - Fill required information (name, email, phone, address)
   - Email verification required
   - Account activated upon verification

2. **Guest Checkout**
   - No registration required for purchases
   - Optional account creation during checkout

### Admin User Setup

#### Super Admin Registration (Initial Setup)

```javascript
// Initial super admin creation (run once)
const createSuperAdmin = {
  email: "superadmin@lakkiphones.com",
  password: "SecurePassword123!",
  name: "Super Administrator",
  role: "super_admin",
  department: "IT",
  permissions: "all"
};
```

#### Admin Role Hierarchy

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

#### Admin Registration Process

1. **Super Admin Creates Account**
   ```bash
   # Access admin panel
   https://www.lakkiphones.com/admin
   
   # Login with super admin credentials
   Email: superadmin@lakkiphones.com
   Password: SecurePassword123!
   ```

2. **Add New Admin Users**
   - Navigate to Admin Panel → Users
   - Click "Add New User"
   - Assign appropriate role and permissions
   - Send invitation email

3. **Role Assignment**
   ```javascript
   const adminRoles = {
     super_admin: ['all_permissions'],
     admin: ['products.*', 'orders.*', 'users.read', 'analytics.read'],
     manager: ['products.read', 'orders.*', 'inventory.*'],
     editor: ['products.update', 'content.*'],
     viewer: ['*.read']
   };
   ```

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

## 📚 API Documentation

### Authentication Endpoints

```javascript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Register
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+96512345678"
}

// Logout
POST /api/auth/logout
```

### Product Endpoints

```javascript
// Get all products
GET /api/products?page=1&limit=20&category=smartphones

// Get single product
GET /api/products/:id

// Create product (Admin only)
POST /api/products
{
  "name": "iPhone 15 Pro",
  "price": 399.500,
  "currency": "KWD",
  "category": "smartphones",
  "brand": "Apple"
}

// Update product (Admin only)
PUT /api/products/:id

// Delete product (Admin only)
DELETE /api/products/:id
```

### Order Endpoints

```javascript
// Create order
POST /api/orders
{
  "items": [
    {
      "productId": "123",
      "quantity": 1,
      "price": 299.500
    }
  ],
  "shippingAddress": {...},
  "paymentMethod": "knet"
}

// Get user orders
GET /api/orders/user/:userId

// Update order status (Admin only)
PUT /api/orders/:id/status
{
  "status": "shipped",
  "trackingNumber": "TRK123456"
}
```

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
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Performance tests
npm run test:performance
```

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