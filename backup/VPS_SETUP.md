# VPS HTTP Setup Guide - LAKKI PHONES

## 🌐 Free Domain Options

### 1. **Freenom** (Recommended)
- **Free domains**: .tk, .ml, .ga, .cf
- **Example**: lakkiphones.tk
- **Setup**: Register at freenom.com
- **DNS**: Free DNS management included

### 2. **No-IP** 
- **Free subdomain**: yourname.ddns.net
- **Example**: lakkiphones.ddns.net
- **Dynamic DNS**: Perfect for VPS

### 3. **DuckDNS**
- **Free subdomain**: yourname.duckdns.org
- **Example**: lakkiphones.duckdns.org
- **Simple setup**: Just email registration

## 🖼️ Large Image Hosting (Free)

### 1. **Cloudinary** (Best for E-commerce)
```javascript
// Free tier: 25GB storage, 25GB bandwidth
const cloudinaryConfig = {
  cloud_name: 'your-cloud-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-secret'
};

// Auto-optimization for large images
const imageUrl = `https://res.cloudinary.com/your-cloud-name/image/upload/w_800,h_600,c_fill,q_auto,f_auto/your-image-id`;
```

### 2. **ImgBB** (Simple Upload)
```javascript
// Free: Unlimited images, direct links
const uploadToImgBB = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch('https://api.imgbb.com/1/upload?key=YOUR_API_KEY', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};
```

### 3. **GitHub Pages** (For static images)
```bash
# Create repo: lakki-images
# Upload images to /images/ folder
# Access via: https://yourusername.github.io/lakki-images/product1.jpg
```

## 🔧 VPS HTTP Configuration

### Nginx Config for HTTP
```nginx
server {
    listen 80;
    server_name lakkiphones.tk www.lakkiphones.tk;
    
    # Large file uploads
    client_max_body_size 100M;
    
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

### Environment Variables for HTTP
```env
# .env file
VITE_APP_NAME=LAKKI PHONES
VITE_APP_URL=http://lakkiphones.tk
VITE_API_URL=http://lakkiphones.tk/api

# Image hosting
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_IMGBB_API_KEY=your-imgbb-key

# KNET (works with HTTP for testing)
VITE_KNET_MERCHANT_ID=test_merchant
VITE_KNET_TERMINAL_ID=test_terminal
VITE_KNET_RESOURCE_KEY=test_key
VITE_KNET_RETURN_URL=http://lakkiphones.tk/payment/success
VITE_KNET_ERROR_URL=http://lakkiphones.tk/payment/error
```

## 🚀 Quick Setup Commands

### 1. Domain Setup (Freenom)
```bash
# 1. Register at freenom.com
# 2. Choose .tk domain: lakkiphones.tk
# 3. Set DNS records:
#    A Record: @ -> YOUR_VPS_IP
#    A Record: www -> YOUR_VPS_IP
```

### 2. VPS Configuration
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Configure firewall
sudo ufw allow 80
sudo ufw allow 22
sudo ufw enable

# Start services
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3. Deploy Application
```bash
# Build for production
npm run build

# Copy to nginx
sudo cp -r dist/* /var/www/html/

# Restart nginx
sudo systemctl restart nginx
```

## 📱 Image Optimization for Large Files

### Auto-resize Component
```javascript
// src/components/ui/OptimizedImage.tsx
import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, alt, width = 800, height = 600, className 
}) => {
  const [loading, setLoading] = useState(true);
  
  // Auto-optimize for Cloudinary
  const optimizedSrc = src.includes('cloudinary.com') 
    ? src.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`)
    : src;
  
  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        onLoad={() => setLoading(false)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};

export default OptimizedImage;
```

## 🔒 HTTP Security Headers
```nginx
# Add to nginx config
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

## 📊 Complete Setup Checklist

### Domain & DNS ✅
- [ ] Register free domain (lakkiphones.tk)
- [ ] Configure DNS A records
- [ ] Test domain resolution

### VPS Configuration ✅
- [ ] Install Nginx
- [ ] Configure HTTP server
- [ ] Set up firewall rules
- [ ] Enable large file uploads

### Image Hosting ✅
- [ ] Setup Cloudinary account
- [ ] Configure API keys
- [ ] Test image uploads
- [ ] Implement auto-optimization

### Application Deployment ✅
- [ ] Build production version
- [ ] Deploy to VPS
- [ ] Configure environment variables
- [ ] Test all functionality

## 🎯 Final Result
- **Domain**: http://lakkiphones.tk
- **Large Images**: Auto-optimized via Cloudinary
- **Performance**: Fast loading with caching
- **Cost**: 100% FREE setup

**Ready to implement complete solution!**