import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from './monitoring.service';

@Injectable()
export class MonitoringMiddleware implements NestMiddleware {
  constructor(private readonly monitoringService: MonitoringService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const monitoringService = this.monitoringService;
    
    // Increment request count
    monitoringService.incrementRequestCount();

    // Log request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${req.ip}`);

    // Override res.end to capture response
    const originalEnd = res.end.bind(res);
    res.end = function(chunk?: any, encoding?: any, cb?: () => void) {
      const duration = Date.now() - startTime;
      
      // Log response
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
      
      // Track errors (4xx and 5xx status codes)
      if (res.statusCode >= 400) {
        monitoringService.incrementErrorCount();
      }
      
      // Call original end method with proper return
      return originalEnd(chunk, encoding, cb);
    };

    next();
  }
}