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

# Configure firewall
print_status "Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Clone repository
print_status "Cloning repository..."
git clone https://github.com/yourusername/Modern-Electronics-E-commerce-Website.git /tmp/lakkiphones
cd /tmp/lakkiphones

# Install dependencies
print_status "Installing dependencies..."
npm install

# Copy configuration files
print_status "Configuring application..."
cp .env.example .env
cp nginx.conf /tmp/lakkiphones.conf

# Update .env file with server IP and domain
SERVER_IP=$(curl -s ifconfig.me)
DOMAIN="lakkiphones.work.gd"
sed -i "s/VITE_APP_URL=.*/VITE_APP_URL=http:\/\/$DOMAIN/" .env
sed -i "s/VITE_API_URL=.*/VITE_API_URL=http:\/\/$DOMAIN\/api/" .env
sed -i "s/SERVER_IP=.*/SERVER_IP=$SERVER_IP/" .env
sed -i "s/DOMAIN=.*/DOMAIN=$DOMAIN/" .env

# Setup application directory
APP_DIR="/var/www/lakkiphones"
print_status "Setting up application directory: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Copy files to application directory
print_status "Copying files to application directory..."
cp -r * $APP_DIR/
cp -r .env $APP_DIR/
cp -r .gitignore $APP_DIR/ 2>/dev/null || :

# Make scripts executable
print_status "Making scripts executable..."
chmod +x $APP_DIR/scripts/start_server.sh
chmod +x $APP_DIR/scripts/stop_server.sh

# Configure Nginx
print_status "Configuring Nginx..."
sudo cp /tmp/lakkiphones.conf /etc/nginx/sites-available/lakkiphones
sudo sed -i "s/lakkiphones.work.gd/$DOMAIN/g" /etc/nginx/sites-available/lakkiphones
sudo ln -sf /etc/nginx/sites-available/lakkiphones /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
print_status "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    print_status "Nginx configuration is valid"
    sudo systemctl restart nginx
else
    print_error "Nginx configuration has errors"
fi

# Start application
print_status "Starting application..."
cd $APP_DIR
./scripts/start_server.sh

# Display summary
print_status "Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "====================="
echo "✅ Application deployed to: $APP_DIR"
echo "✅ Server running at: http://$SERVER_IP:5173"
echo "✅ Domain configured: http://$DOMAIN (after DNS propagation)"
echo ""
echo "🔐 Admin Login:"
echo "  Email: admin@lakkiphones.com"
echo "  Password: admin123"
echo ""
echo "📝 Next steps:"
echo "  1. Configure your domain DNS to point to $SERVER_IP"
echo "  2. Wait for DNS propagation (may take up to 48 hours)"
echo "  3. Access your site at http://$DOMAIN"
echo ""
echo "🛠️ Useful commands:"
echo "  - Start server: cd $APP_DIR && ./scripts/start_server.sh"
echo "  - Stop server: cd $APP_DIR && ./scripts/stop_server.sh"
echo "  - View logs: tail -f $APP_DIR/server.log"
echo ""
echo "Thank you for using LAKKI PHONES!"