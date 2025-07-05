# VPS Deployment Guide

## Quick Setup Commands

### 1. Install Node.js and npm
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 3. Clone and Setup Project
```bash
# Clone your project
git clone <your-repo-url>
cd electronics-ecommerce

# Install dependencies
npm install

# Build the project
npm run build
```

### 4. Configure PM2
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'lakkiphones',
    script: 'npm',
    args: 'run preview',
    cwd: '/path/to/your/project',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 4173
    }
  }]
};
```

### 5. Start Application
```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 6. Configure Nginx (Reverse Proxy)
```bash
# Install Nginx
sudo apt install nginx -y

# Create site configuration
sudo nano /etc/nginx/sites-available/lakkiphones
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name www.lakkiphones.com lakkiphones.com;

    location / {
        proxy_pass http://localhost:4173;
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

### 7. Enable Site and Restart Nginx
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/lakkiphones /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 8. Configure Firewall
```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

### 9. SSL Certificate (Optional but Recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d lakkiphones.com -d www.lakkiphones.com
```

## Troubleshooting

### Check if application is running:
```bash
pm2 status
pm2 logs lakkiphones
```

### Check Nginx status:
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Check firewall:
```bash
sudo ufw status
```

### Check ports:
```bash
sudo netstat -tlnp | grep :4173
sudo netstat -tlnp | grep :80
```

## Access Your Application

- **Local**: http://localhost:4173
- **VPS IP**: http://YOUR_VPS_IP
- **Domain**: http://www.lakkiphones.com

## Environment Variables

Create `.env` file in project root:
```env
VITE_APP_NAME=LAKKI PHONES
VITE_APP_URL=https://www.lakkiphones.com
VITE_API_URL=https://api.lakkiphones.com
VITE_KNET_MERCHANT_ID=your_merchant_id
VITE_KNET_TERMINAL_ID=your_terminal_id
VITE_KNET_RESOURCE_KEY=your_resource_key
```

## Monitoring

### PM2 Monitoring:
```bash
pm2 monit
```

### Nginx Logs:
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Updates

To update the application:
```bash
git pull origin main
npm install
npm run build
pm2 restart lakkiphones
```