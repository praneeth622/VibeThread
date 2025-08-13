# VibeThread Backend Monitoring

This document describes the monitoring system implemented for the VibeThread backend API.

## Overview

The monitoring system provides real-time insights into:
- System health and service availability
- Resource usage (CPU, memory, disk)
- Application performance metrics
- Request/error statistics

## Monitoring Endpoints

### Health Check
```
GET /api/monitoring/health
```
Returns the overall health status of the application and its dependencies.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "services": {
    "database": "up",
    "ffmpeg": "available",
    "ytdlp": "available",
    "acrcloud": "reachable"
  },
  "version": "1.0.0",
  "environment": "production"
}
```

### System Metrics
```
GET /api/monitoring/metrics
```
Returns detailed system resource usage metrics.

**Response:**
```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600,
  "memory": {
    "total": 8589934592,
    "free": 4294967296,
    "used": 4294967296,
    "usedPercentage": 50
  },
  "cpu": {
    "loadAverage": [1.2, 1.1, 1.0],
    "usage": 25.5
  },
  "disk": {
    "total": 107374182400,
    "free": 53687091200,
    "used": 53687091200,
    "usedPercentage": 50
  },
  "process": {
    "pid": 1234,
    "memory": {
      "rss": 134217728,
      "heapTotal": 67108864,
      "heapUsed": 33554432,
      "external": 16777216
    },
    "uptime": 3600
  }
}
```

### Application Statistics
```
GET /api/monitoring/stats
```
Returns application-specific statistics and performance metrics.

**Response:**
```json
{
  "startTime": "2024-01-01T11:00:00.000Z",
  "uptime": 3600,
  "requestCount": 1500,
  "errorCount": 25,
  "errorRate": 1.67,
  "nodeVersion": "v20.10.0",
  "platform": "linux",
  "architecture": "x64"
}
```

### Ping
```
GET /api/monitoring/ping
```
Simple ping endpoint for basic connectivity testing.

**Response:**
```json
{
  "message": "pong",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600
}
```

## Monitoring Dashboard

### Web Dashboard
Access the real-time monitoring dashboard at:
```
GET /api/monitoring/dashboard
```

The dashboard provides:
- 🟢 Real-time health status indicators
- 📊 Interactive system metrics with progress bars
- 📈 Application statistics and performance data
- 🔄 Auto-refresh functionality (30-second intervals)
- 📱 Responsive design for mobile and desktop

### Features
- **Health Status**: Visual indicators for system health
- **Resource Monitoring**: Memory, CPU, and disk usage with progress bars
- **Performance Metrics**: Request counts, error rates, and uptime
- **Service Status**: FFmpeg, yt-dlp, and ACRCloud availability
- **Auto Refresh**: Configurable automatic data refresh
- **Error Handling**: Graceful error display for failed requests

## Request/Error Tracking

The monitoring system automatically tracks:
- Total number of API requests
- Number of failed requests (4xx/5xx status codes)
- Error rate percentage
- Request timing and performance

### Middleware Integration
All requests are automatically logged with:
- Timestamp
- HTTP method and URL
- Client IP address
- Response status code
- Response time in milliseconds

## Alerting and Notifications

### Health Check Integration
The health check endpoint can be integrated with external monitoring services:

```bash
# Example health check with curl
curl -f https://vibethread-backend.praneethd.xyz/api/monitoring/health

# Example with monitoring services
# Uptime Robot, Pingdom, DataDog, etc.
```

### Custom Alerts
You can set up custom alerts based on:
- Memory usage > 80%
- Disk usage > 90%
- Error rate > 5%
- Service unavailability
- High response times

## Production Monitoring

### Recommended Setup
1. **External Monitoring**: Use services like Uptime Robot or Pingdom
2. **Log Aggregation**: Implement centralized logging (ELK stack, Splunk)
3. **Metrics Collection**: Use Prometheus + Grafana for detailed metrics
4. **Alerting**: Set up PagerDuty or similar for critical alerts

### Environment Variables
```env
# Optional monitoring configuration
MONITORING_ENABLED=true
MONITORING_INTERVAL=30000
LOG_LEVEL=info
```

### Docker Health Checks
The monitoring endpoints integrate with Docker health checks:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/monitoring/health || exit 1
```

## Security Considerations

### Access Control
- Monitor endpoints are publicly accessible for health checks
- Consider implementing authentication for detailed metrics
- Use HTTPS in production environments
- Implement rate limiting for monitoring endpoints

### Data Privacy
- No sensitive data is exposed in monitoring endpoints
- System metrics are aggregated and anonymized
- Request logs don't include request bodies or headers

## Troubleshooting

### Common Issues

1. **High Memory Usage**
   - Check for memory leaks in application code
   - Monitor Node.js heap usage
   - Consider increasing server resources

2. **High Error Rates**
   - Check application logs for specific errors
   - Verify external service availability (ACRCloud, etc.)
   - Monitor network connectivity

3. **Service Unavailability**
   - Verify FFmpeg installation: `ffmpeg -version`
   - Check yt-dlp installation: `yt-dlp --version`
   - Test ACRCloud connectivity

### Monitoring Commands
```bash
# Check system resources
htop
df -h
free -h

# Check application logs
pm2 logs vibethread-backend
tail -f /var/log/vibethread.log

# Test monitoring endpoints
curl https://vibethread-backend.praneethd.xyz/api/monitoring/health
curl https://vibethread-backend.praneethd.xyz/api/monitoring/metrics
```

## Integration Examples

### Prometheus Metrics
```javascript
// Example Prometheus integration
const prometheus = require('prom-client');
const register = new prometheus.Registry();

// Custom metrics
const httpRequestsTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

register.registerMetric(httpRequestsTotal);
```

### Grafana Dashboard
Create custom dashboards using the metrics endpoints as data sources.

### Log Analysis
```bash
# Analyze request patterns
grep "POST /api/audio/extract-audio" /var/log/vibethread.log | wc -l

# Check error rates
grep "ERROR" /var/log/vibethread.log | tail -20
```

## Performance Optimization

Based on monitoring data, consider:
- Scaling horizontally with multiple instances
- Implementing caching for frequently accessed data
- Optimizing database queries (if applicable)
- Using CDN for static assets
- Implementing request queuing for heavy operations

The monitoring system provides the data needed to make informed decisions about performance optimization and scaling strategies.