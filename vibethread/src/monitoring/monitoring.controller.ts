import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { MonitoringService, SystemMetrics, HealthStatus } from './monitoring.service';
import * as path from 'path';

@ApiTags('monitoring')
@Controller('api/monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('health')
  @ApiOperation({ summary: 'Get application health status' })
  @ApiResponse({ status: 200, description: 'Health status retrieved successfully' })
  async getHealth(): Promise<HealthStatus> {
    return this.monitoringService.getHealthStatus();
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get system metrics' })
  @ApiResponse({ status: 200, description: 'System metrics retrieved successfully' })
  async getMetrics(): Promise<SystemMetrics> {
    return this.monitoringService.getSystemMetrics();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get application statistics' })
  @ApiResponse({ status: 200, description: 'Application stats retrieved successfully' })
  getStats() {
    return this.monitoringService.getApplicationStats();
  }

  @Get('ping')
  @ApiOperation({ summary: 'Simple ping endpoint' })
  @ApiResponse({ status: 200, description: 'Pong response' })
  ping() {
    return {
      message: 'pong',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get monitoring dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard HTML page' })
  getDashboard(@Res() res: Response) {
    const dashboardPath = path.join(process.cwd(), 'public', 'monitoring.html');
    return res.sendFile(dashboardPath);
  }
}