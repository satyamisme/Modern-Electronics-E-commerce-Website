#!/bin/bash

# LAKKI PHONES VPS Deployment Script
# Run this script on your VPS to deploy the application

echo "🚀 Starting LAKKI PHONES deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
print_status "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
node_version=$(node --version)
npm_version=$(npm --version)
print_status "Node.js version: $node_version"
print_status "NPM version: $npm_version"

# Install Nginx
print_status "Installing Nginx..."
sudo apt install nginx -y

# Install PM2 for process management
print_status "Installing PM2..."
sudo npm install -g pm2

# Create application directory
APP_DIR="/var/www/lakkiphones"
print_status "Creating application directory: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Clone or copy application files
print_status "Setting up application files..."
cd $APP_DIR

# If you have the files locally, copy them
# Otherwise, you can clone from a repository
# git clone https://github.com/yourusername/lakki-phones.git .

# Install dependencies
print_status "Installing application dependencies..."
npm install

# Build the application
print_status "Building application for production..."
npm run build

# Copy built files to Nginx directory
print_status "Copying built files to Nginx..."
sudo cp -r dist/* /var/www/html/

# Copy Nginx configuration
print_status "Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/lakkiphones
sudo ln -sf /etc/nginx/sites-available/lakkiphones /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
print_status "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    print_status "Nginx configuration is valid"
else
    print_error "Nginx configuration has errors"
    exit 1
fi

# Configure firewall
print_status "Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Start and enable services
print_status "Starting services..."
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl restart nginx

# Create environment file
print_status "Creating environment configuration..."
cat > .env << EOF
# LAKKI PHONES Environment Configuration
VITE_APP_NAME=LAKKI PHONES
VITE_APP_URL=http://lakkiphones.tk
VITE_API_URL=http://lakkiphones.tk/api

# Image hosting (Cloudinary)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_API_KEY=your-api-key
VITE_CLOUDINARY_UPLOAD_PRESET=unsigned

# Alternative: ImgBB
VITE_IMGBB_API_KEY=your-imgbb-key

# KNET Payment (Test mode)
VITE_KNET_MERCHANT_ID=test_merchant
VITE_KNET_TERMINAL_ID=test_terminal
VITE_KNET_RESOURCE_KEY=test_key
VITE_KNET_RETURN_URL=http://lakkiphones.tk/payment/success
VITE_KNET_ERROR_URL=http://lakkiphones.tk/payment/error

# Supabase (if using)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
EOF

print_warning "Please update the .env file with your actual API keys and configuration"

# Create PM2 ecosystem file for backend (if needed)
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'lakki-phones-api',
    script: 'npm',
    args: 'run start:api',
    cwd: '$APP_DIR',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Set up log rotation
print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/lakkiphones > /dev/null << EOF
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 nginx nginx
    postrotate
        systemctl reload nginx
    endscript
}
EOF

# Create deployment info
print_status "Creating deployment information..."
cat > deployment-info.txt << EOF
LAKKI PHONES Deployment Information
==================================

Deployment Date: $(date)
Server IP: $(curl -s ifconfig.me)
Domain: lakkiphones.tk
Application Directory: $APP_DIR
Nginx Config: /etc/nginx/sites-available/lakkiphones

Services Status:
- Nginx: $(systemctl is-active nginx)
- UFW Firewall: $(sudo ufw status | head -1)

Next Steps:
1. Configure your domain DNS to point to this server IP
2. Update .env file with your API keys
3. Test the application at http://your-domain
4. Set up SSL certificate (optional)

Useful Commands:
- Check Nginx status: sudo systemctl status nginx
- Restart Nginx: sudo systemctl restart nginx
- View Nginx logs: sudo tail -f /var/log/nginx/error.log
- Check firewall: sudo ufw status
EOF

# Display deployment summary
print_status "Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "====================="
echo "✅ System updated"
echo "✅ Node.js and NPM installed"
echo "✅ Nginx installed and configured"
echo "✅ Application built and deployed"
echo "✅ Firewall configured"
echo "✅ Services started"
echo ""
echo "🌐 Your application should be accessible at:"
echo "   http://$(curl -s ifconfig.me)"
echo "   http://lakkiphones.tk (after DNS configuration)"
echo ""
echo "📝 Next steps:"
echo "   1. Configure your domain DNS"
echo "   2. Update .env file with API keys"
echo "   3. Test the application"
echo ""
echo "📄 Check deployment-info.txt for detailed information"

print_status "Deployment script completed!"