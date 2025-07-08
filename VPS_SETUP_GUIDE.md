# LAKKI PHONES - VPS Setup Guide

This guide provides comprehensive instructions for setting up the LAKKI PHONES e-commerce platform on your VPS.

## 🚀 Quick Setup

### 1. Clone the Repository
```bash
# Clone the repository to your VPS
git clone https://github.com/yourusername/Modern-Electronics-E-commerce-Website.git
cd Modern-Electronics-E-commerce-Website
```

### 2. Install Dependencies
```bash
# Install Node.js dependencies
npm install
```

### 3. Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit the .env file with your settings
nano .env
```

### 4. Start the Application
```bash
# Start the application using the provided scripts
chmod +x scripts/start_server.sh scripts/stop_server.sh
./scripts/start_server.sh
```

## 🌐 Domain Configuration

### Option 1: Using work.gd Domain (Free)
1. Log in to your work.gd account
2. Navigate to DNS management
3. Add an A record:
   - Host: `@` (or subdomain)
   - Points to: Your VPS IP (`62.171.128.156`)
   - TTL: Default (or 3600)
4. Add a CNAME record for www:
   - Host: `www`
   - Points to: `lakkiphones.work.gd`
   - TTL: Default (or 3600)

### Option 2: Using Other Free Domain Providers
- **Freenom**: Register domains like .tk, .ml, .ga, .cf, .gq
- **No-IP**: Get a free subdomain like `lakkiphones.ddns.net`
- **DuckDNS**: Get a free subdomain like `lakkiphones.duckdns.org`

### DNS Propagation
- DNS changes may take 15 minutes to 48 hours to propagate
- You can check propagation status at [whatsmydns.net](https://www.whatsmydns.net/)

## 🔧 Server Configuration

### Nginx Configuration (Optional)
If you want to use Nginx as a reverse proxy:

1. Install Nginx:
```bash
sudo apt update
sudo apt install nginx
```

2. Create a configuration file:
```bash
sudo nano /etc/nginx/sites-available/lakkiphones
```

3. Add this configuration:
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
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/lakkiphones /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. Configure firewall:
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

## 📁 File Structure

```
Modern-Electronics-E-commerce-Website/
├── public/                  # Static assets
├── src/                     # Source code
├── scripts/                 # Server management scripts
│   ├── start_server.sh      # Start the development server
│   └── stop_server.sh       # Stop the development server
├── .env                     # Environment variables
├── .env.example             # Example environment variables
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

## ⚙️ Environment Configuration

Edit your `.env` file with the following settings:

```env
# Application Settings
VITE_APP_NAME=LAKKI PHONES
VITE_APP_URL=http://lakkiphones.work.gd
VITE_API_URL=http://lakkiphones.work.gd/api

# Image Hosting (Choose one)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_API_KEY=your-api-key
VITE_CLOUDINARY_UPLOAD_PRESET=unsigned

# KNET Payment Gateway (Kuwait)
VITE_KNET_MERCHANT_ID=test_merchant_id
VITE_KNET_TERMINAL_ID=test_terminal_id
VITE_KNET_RESOURCE_KEY=test_resource_key
VITE_KNET_RETURN_URL=http://lakkiphones.work.gd/payment/success
VITE_KNET_ERROR_URL=http://lakkiphones.work.gd/payment/error

# Development Settings
VITE_DEBUG=false
VITE_LOG_LEVEL=error
```

## 🔄 Server Management Scripts

The repository includes two scripts for managing the development server:

### start_server.sh
This script starts the Vite development server in the background, making it accessible from your VPS IP address.

```bash
#!/bin/bash
# Navigate to the project directory if needed
# cd /path/to/your/project

echo "Starting Vite development server..."

# Start the server in the background, listen on all available IPs,
# redirect stdout/stderr to server.log, and save the PID
nohup npm run dev -- --host 0.0.0.0 > server.log 2>&1 &
echo $! > server.pid

echo "Server started. Output is in server.log. PID is in server.pid"
echo "You can access it via http://your-vps-ip:5173"
```

### stop_server.sh
This script stops the running development server.

```bash
#!/bin/bash
echo "Stopping Vite development server..."

if [ -f server.pid ]; then
    PID=$(cat server.pid)
    if ps -p $PID > /dev/null; then
        kill $PID
        echo "Server with PID $PID stopped."
    else
        echo "Server with PID $PID not found. It might have already been stopped."
    fi
    rm server.pid
else
    echo "server.pid not found. Is the server running or was it started with start_server.sh?"
fi
```

## 🔒 Security Considerations

1. **Firewall Configuration**:
   - Ensure only necessary ports are open (80, 443, 22)
   - Use `ufw` or `iptables` to manage firewall rules

2. **HTTPS Setup** (Recommended for Production):
   - Install Certbot: `sudo apt install certbot python3-certbot-nginx`
   - Obtain SSL certificate: `sudo certbot --nginx -d lakkiphones.work.gd -d www.lakkiphones.work.gd`

3. **Regular Updates**:
   - Keep your system updated: `sudo apt update && sudo apt upgrade`
   - Update Node.js and npm packages regularly

## 🔍 Troubleshooting

### Server Not Starting
- Check if Node.js is installed correctly: `node --version`
- Verify npm dependencies are installed: `npm install`
- Check server logs: `cat server.log`
- Ensure port 5173 is not in use: `sudo netstat -tulpn | grep 5173`

### Domain Not Resolving
- Verify DNS settings in your domain provider's dashboard
- Check DNS propagation: `nslookup lakkiphones.work.gd`
- Ensure your VPS IP is correct: `curl ifconfig.me`

### Application Errors
- Check browser console for JavaScript errors
- Verify environment variables are set correctly
- Check server logs: `cat server.log`

## 📱 Accessing the Application

- **Development**: http://your-vps-ip:5173 or http://lakkiphones.work.gd
- **Admin Panel**: http://your-vps-ip:5173/admin or http://lakkiphones.work.gd/admin

### Admin Login Credentials
- **Email**: admin@lakkiphones.com
- **Password**: admin123

## 🔄 Updating the Application

To update the application with the latest changes:

```bash
# Stop the server
./scripts/stop_server.sh

# Pull the latest changes
git pull

# Install any new dependencies
npm install

# Start the server again
./scripts/start_server.sh
```

## 📊 Monitoring

To monitor the application:

```bash
# View server logs
tail -f server.log

# Check if server is running
ps aux | grep node

# Monitor system resources
htop
```

## 🚀 Production Deployment

For a production environment, consider:

1. Building the application: `npm run build`
2. Serving the static files with Nginx
3. Setting up HTTPS with Let's Encrypt
4. Implementing a proper CI/CD pipeline

## 📞 Support

If you encounter any issues, please contact:
- **Email**: support@lakkiphones.com
- **Phone**: 50430606 / 55463597