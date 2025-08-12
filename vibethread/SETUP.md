# VibeThread Backend - EC2 Ubuntu Setup Guide

This guide will help you deploy the VibeThread backend on an Ubuntu EC2 instance.

## Prerequisites

- AWS EC2 instance running Ubuntu 20.04 LTS or later
- SSH access to your EC2 instance
- Security group allowing inbound traffic on port 3000
- At least 1GB RAM and 10GB storage

## Step 1: Connect to Your EC2 Instance

```bash
# Replace with your key file and instance details
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

## Step 2: Update System Packages

```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git build-essential
```

## Step 3: Install Node.js 20

```bash
# Install Node.js 20 using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

## Step 4: Install System Dependencies

```bash
# Install ffmpeg
sudo apt install -y ffmpeg

# Install Python 3 and pip (usually pre-installed on Ubuntu)
sudo apt install -y python3 python3-pip

# Install yt-dlp
pip3 install yt-dlp

# Add pip local bin to PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify installations
ffmpeg -version
yt-dlp --version
```

## Step 5: Install Docker (Optional but Recommended)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verify Docker installation
docker --version
```

## Step 6: Clone and Setup Application

```bash
# Clone your repository
git clone <your-repository-url>
cd vibethread

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit environment file with your credentials
nano .env
```

### Configure .env file:
```env
ACR_ACCESS_KEY=your_actual_acrcloud_key
ACR_ACCESS_SECRET=your_actual_acrcloud_secret
ACR_HOST=identify-ap-southeast-1.acrcloud.com
PORT=3000
NODE_ENV=production
```

## Step 7: Build and Test Application

```bash
# Build the application
npm run build

# Test the application
npm run start:prod &

# Test API endpoint
curl http://localhost:3000/api/audio/health

# Stop the test
pkill -f "node dist/main"
```

## Step 8: Setup PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application with PM2
pm2 start dist/main.js --name vibethread-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above

# Monitor application
pm2 status
pm2 logs vibethread-backend
```

## Step 9: Setup Nginx Reverse Proxy (Optional)

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/vibethread
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

    location / {
        proxy_pass http://localhost:3000;
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

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/vibethread /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Step 10: Configure Firewall

```bash
# Install and configure UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 3000
sudo ufw status
```

## Step 11: Setup SSL with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Alternative: Docker Deployment

If you prefer Docker deployment:

```bash
# Build Docker image
docker build -t vibethread-backend .

# Run with Docker
docker run -d \
  --name vibethread-backend \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  -v $(pwd)/public/audio/downloads:/app/public/audio/downloads \
  vibethread-backend

# Check logs
docker logs vibethread-backend

# Monitor container
docker stats vibethread-backend
```

## Monitoring and Maintenance

### Check Application Status
```bash
# PM2 status
pm2 status

# View logs
pm2 logs vibethread-backend

# Restart application
pm2 restart vibethread-backend
```

### System Monitoring
```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top

# Check network connections
netstat -tulpn | grep :3000
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild application
npm run build

# Restart with PM2
pm2 restart vibethread-backend
```

## Troubleshooting

### Common Issues

1. **Port 3000 not accessible**
   - Check EC2 security group allows inbound traffic on port 3000
   - Verify UFW firewall rules: `sudo ufw status`

2. **yt-dlp command not found**
   ```bash
   # Reinstall yt-dlp
   pip3 install --upgrade yt-dlp
   # Add to PATH
   export PATH="$HOME/.local/bin:$PATH"
   ```

3. **ffmpeg not working**
   ```bash
   # Reinstall ffmpeg
   sudo apt update
   sudo apt install --reinstall ffmpeg
   ```

4. **Permission errors**
   ```bash
   # Fix permissions
   sudo chown -R ubuntu:ubuntu /path/to/vibethread
   chmod -R 755 public/audio/downloads
   ```

5. **Out of memory errors**
   - Upgrade to larger EC2 instance
   - Add swap space:
   ```bash
   sudo fallocate -l 1G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

### Logs Location
- Application logs: `pm2 logs vibethread-backend`
- Nginx logs: `/var/log/nginx/`
- System logs: `/var/log/syslog`

## Security Best Practices

1. **Keep system updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Use environment variables for secrets**
   - Never commit `.env` file to git
   - Use AWS Secrets Manager for production

3. **Regular backups**
   - Backup your application code
   - Backup environment configuration

4. **Monitor resource usage**
   - Set up CloudWatch monitoring
   - Configure alerts for high CPU/memory usage

## Performance Optimization

1. **Enable gzip compression in Nginx**
2. **Use PM2 cluster mode for multiple cores**
3. **Implement rate limiting**
4. **Monitor and optimize ACRCloud API usage**

Your VibeThread backend should now be running successfully on EC2 Ubuntu!

## Testing Your Deployment

```bash
# Test health endpoint
curl http://your-ec2-ip:3000/api/audio/health

# Test with a sample Instagram URL
curl -X POST http://your-ec2-ip:3000/api/audio/extract-audio \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.instagram.com/reel/sample-url/"}'
```