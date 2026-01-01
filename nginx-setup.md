# NGINX Load Balancer Setup Guide

This guide explains how to set up NGINX as a reverse proxy and load balancer for the ACMS backend.

## Prerequisites

- NGINX installed on your server
- Multiple backend instances running (via PM2 cluster or multiple containers)
- Backend instances accessible on the configured ports

## Installation

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install nginx
```

### CentOS/RHEL
```bash
sudo yum install nginx
```

### macOS
```bash
brew install nginx
```

## Configuration

1. **Copy the configuration file:**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/acms
   sudo ln -s /etc/nginx/sites-available/acms /etc/nginx/sites-enabled/
   ```

   Or for CentOS/RHEL:
   ```bash
   sudo cp nginx.conf /etc/nginx/conf.d/acms.conf
   ```

2. **Update the upstream servers:**
   - Edit `/etc/nginx/sites-available/acms` (or `/etc/nginx/conf.d/acms.conf`)
   - Update the `upstream acms_backend` block with your actual backend ports
   - If using PM2 cluster mode, all instances typically use the same port (e.g., 5000)
   - If using multiple containers, configure different ports

3. **For PM2 Cluster Mode (single port):**
   ```nginx
   upstream acms_backend {
       least_conn;
       server localhost:5000;  # Single port for PM2 cluster
       keepalive 32;
   }
   ```

4. **For Multiple Container Instances:**
   ```nginx
   upstream acms_backend {
       least_conn;
       server backend1:5000 max_fails=3 fail_timeout=30s;
       server backend2:5000 max_fails=3 fail_timeout=30s;
       server backend3:5000 max_fails=3 fail_timeout=30s;
       keepalive 32;
   }
   ```

5. **Update server_name:**
   - Change `server_name localhost;` to your actual domain name in production

6. **Test the configuration:**
   ```bash
   sudo nginx -t
   ```

7. **Reload NGINX:**
   ```bash
   sudo systemctl reload nginx
   # or
   sudo service nginx reload
   ```

## Load Balancing Methods

The configuration uses `least_conn` (least connections) by default. Other options:

- **least_conn** (default): Routes to server with fewest active connections
- **ip_hash**: Routes based on client IP (sticky sessions)
- **round_robin**: Distributes requests evenly (default if not specified)
- **weight**: Assign weights to servers for uneven distribution

Example with weights:
```nginx
upstream acms_backend {
    least_conn;
    server localhost:5000 weight=3;
    server localhost:5001 weight=2;
    server localhost:5002 weight=1;
    keepalive 32;
}
```

## Rate Limiting

The configuration includes:
- **General API**: 100 requests/minute per IP
- **Auth endpoints**: 5 requests/minute per IP

To adjust, modify the `limit_req_zone` directives.

## SSL/HTTPS Setup (Production)

1. Obtain SSL certificates (Let's Encrypt recommended):
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

2. Or uncomment and configure the HTTPS server block in `nginx.conf`

## Monitoring

Check NGINX status:
```bash
sudo systemctl status nginx
```

View access logs:
```bash
sudo tail -f /var/log/nginx/acms_access.log
```

View error logs:
```bash
sudo tail -f /var/log/nginx/acms_error.log
```

## Troubleshooting

1. **502 Bad Gateway**: Backend servers are not running or not accessible
2. **503 Service Unavailable**: All backend servers are down
3. **429 Too Many Requests**: Rate limit exceeded
4. **Connection refused**: Check backend server ports and firewall rules

## Performance Tuning

For high traffic, consider:
- Increasing `worker_processes` in `/etc/nginx/nginx.conf`
- Adjusting `worker_connections`
- Enabling gzip compression
- Tuning buffer sizes

Example in `/etc/nginx/nginx.conf`:
```nginx
worker_processes auto;
worker_connections 1024;

gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

