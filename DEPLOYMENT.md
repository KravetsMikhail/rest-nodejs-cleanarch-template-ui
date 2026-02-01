# Deployment Guide

## Overview

This guide covers deployment options for the Task Management System UI application.

## Prerequisites

### System Requirements

- **Node.js** 18.0 or higher
- **npm** 8.0 or higher or **yarn** 1.22 or higher
- **Docker** 20.0 or higher (for containerized deployment)
- **Nginx** or similar reverse proxy (recommended for production)

### Required Services

The frontend application depends on:

1. **REST API Server** - `http://localhost:1234/api/v1`
2. **Keycloak Server** - `http://localhost:8282`
3. **PostgreSQL Database** - Used by the API server

## Environment Configuration

### Environment Variables

Create a `.env.production` file for production:

```env
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_KEYCLOAK_URL=https://keycloak.yourdomain.com
VITE_KEYCLOAK_REALM=your-realm
VITE_KEYCLOAK_CLIENT_ID=your-client-id
```

### Development Environment

```env
VITE_API_URL=http://localhost:1234/api/v1
VITE_KEYCLOAK_URL=http://localhost:8282
VITE_KEYCLOAK_REALM=rest-nodejs-cleanarch-template
VITE_KEYCLOAK_CLIENT_ID=rest-nodejs-cleanarch-template-ui
```

## Build Process

### Production Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# The build output will be in the `dist/` directory
```

### Build Output Structure

```
dist/
├── index.html              # Main HTML file
├── assets/
│   ├── vendor-*.js         # Vendor libraries
│   ├── index-*.js          # Application code
│   ├── mui-*.js            # Material-UI components
│   └── refine-*.js         # Refine framework
└── favicon.ico             # Favicon
```

## Deployment Options

### Option 1: Static File Server

#### Using Nginx

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       root /path/to/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # API proxy
       location /api/ {
           proxy_pass http://localhost:1234;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **Start Nginx:**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

#### Using Apache

Create `.htaccess` in the `dist/` directory:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

Apache configuration:

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /path/to/dist
    
    <Directory /path/to/dist>
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

### Option 2: Docker Deployment

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        location /api/ {
            proxy_pass http://host.docker.internal:1234;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

#### Build and Run

```bash
# Build Docker image
docker build -t task-management-ui .

# Run container
docker run -d -p 80:80 task-management-ui
```

### Option 3: Docker Compose

#### docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - api
      - keycloak
    networks:
      - app-network

  api:
    image: your-api-image
    ports:
      - "1234:1234"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@postgres:5432/dbname
    depends_on:
      - postgres
    networks:
      - app-network

  keycloak:
    image: quay.io/keycloak/keycloak:latest
    ports:
      - "8282:8080"
    environment:
      - KEYCLOAK_ADMIN=admin
      - KEYCLOAK_ADMIN_PASSWORD=admin
    networks:
      - app-network

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=taskdb
      - POSTGRES_USER=taskuser
      - POSTGRES_PASSWORD=taskpass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

#### Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f frontend

# Stop services
docker-compose down
```

### Option 4: Cloud Platforms

#### Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Configure vercel.json:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

#### Netlify Deployment

1. **Create netlify.toml:**
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

## SSL/HTTPS Configuration

### Let's Encrypt with Nginx

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:1234;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build --analyze

# Source maps for debugging
npm run build --sourceMap
```

### Nginx Performance

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# Browser caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Monitoring and Logging

### Application Monitoring

```javascript
// Add to main component
useEffect(() => {
  // Performance monitoring
  if ('performance' in window) {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart);
  }
}, []);
```

### Error Tracking

```typescript
// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Send to error tracking service
});
```

## Security Considerations

### Content Security Policy

```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  connect-src 'self' https://keycloak.yourdomain.com https://api.yourdomain.com;
">
```

### Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

## Troubleshooting

### Common Deployment Issues

1. **404 Errors on Refresh**
   - Ensure proper SPA routing configuration
   - Check Nginx/Apache rewrite rules

2. **CORS Issues**
   - Configure backend to allow frontend origin
   - Check preflight requests

3. **Authentication Issues**
   - Verify Keycloak URLs are correct
   - Check redirect URIs in Keycloak

4. **API Connection Issues**
   - Verify API server is running
   - Check network connectivity
   - Validate environment variables

### Debug Commands

```bash
# Check build output
ls -la dist/

# Test static server
python -m http.server 8000 --directory dist

# Check environment variables
printenv | grep VITE_
```

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Security audit
npm audit

# Fix security issues
npm audit fix
```

### Backup Strategy

- Backup build artifacts
- Backup configuration files
- Document any custom modifications
- Version control deployment scripts

## Rollback Procedure

### Quick Rollback

```bash
# Git rollback
git checkout previous-commit-tag
npm run build
# Deploy previous version
```

### Blue-Green Deployment

1. Deploy new version to green environment
2. Test thoroughly
3. Switch traffic from blue to green
4. Keep blue as backup

This deployment guide covers the most common deployment scenarios for the Task Management System UI. Choose the option that best fits your infrastructure and requirements.
