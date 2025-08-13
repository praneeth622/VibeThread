import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import * as fs from 'fs';

const execAsync = promisify(exec);

export interface SystemMetrics {
  timestamp: string;
  uptime: number;
  memory: {
    total: number;
    free: number;
    used: number;
    usedPercentage: number;
  };
  cpu: {
    loadAverage: number[];
    usage: number;
  };
  disk: {
    total: number;
    free: number;
    used: number;
    usedPercentage: number;
  };
  process: {
    pid: number;
    memory: NodeJS.MemoryUsage;
    uptime: number;
  };
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'up' | 'down';
    ffmpeg: 'available' | 'unavailable';
    ytdlp: 'available' | 'unavailable';
    acrcloud: 'reachable' | 'unreachable';
  };
  version: string;
  environment: string;
}

@Injectable()
export class MonitoringService {
  private startTime = Date.now();
  private requestCount = 0;
  private errorCount = 0;

  incrementRequestCount() {
    this.requestCount++;
  }

  incrementErrorCount() {
    this.errorCount++;
  }

  getRequestCount(): number {
    return this.requestCount;
  }

  getErrorCount(): number {
    return this.errorCount;
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // Get disk usage
    let diskInfo = { total: 0, free: 0, used: 0, usedPercentage: 0 };
    try {
      const { stdout } = await execAsync('df -h / | tail -1');
      const parts = stdout.trim().split(/\s+/);
      if (parts.length >= 4) {
        diskInfo = {
          total: this.parseSize(parts[1]),
          used: this.parseSize(parts[2]),
          free: this.parseSize(parts[3]),
          usedPercentage: parseInt(parts[4].replace('%', ''))
        };
      }
    } catch (error) {
      console.warn('Could not get disk usage:', error.message);
    }

    return {
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      memory: {
        total: totalMemory,
        free: freeMemory,
        used: usedMemory,
        usedPercentage: Math.round((usedMemory / totalMemory) * 100)
      },
      cpu: {
        loadAverage: os.loadavg(),
        usage: await this.getCpuUsage()
      },
      disk: diskInfo,
      process: {
        pid: process.pid,
        memory: process.memoryUsage(),
        uptime: Math.floor(process.uptime())
      }
    };
  }

  async getHealthStatus(): Promise<HealthStatus> {
    const services = {
      database: 'up' as const, // Since we're not using a database
      ffmpeg: await this.checkFFmpeg(),
      ytdlp: await this.checkYtDlp(),
      acrcloud: await this.checkACRCloud()
    };

    const allServicesHealthy = Object.values(services).every(
      status => status === 'up' || status === 'available' || status === 'reachable'
    );

    return {
      status: allServicesHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
  }

  private async checkFFmpeg(): Promise<'available' | 'unavailable'> {
    try {
      await execAsync('ffmpeg -version');
      return 'available';
    } catch {
      return 'unavailable';
    }
  }

  private async checkYtDlp(): Promise<'available' | 'unavailable'> {
    try {
      await execAsync('yt-dlp --version');
      return 'available';
    } catch {
      return 'unavailable';
    }
  }

  private async checkACRCloud(): Promise<'reachable' | 'unreachable'> {
    try {
      const acrHost = process.env.ACR_HOST || 'identify-ap-southeast-1.acrcloud.com';
      await execAsync(`ping -c 1 ${acrHost}`, { timeout: 5000 });
      return 'reachable';
    } catch {
      return 'unreachable';
    }
  }

  private async getCpuUsage(): Promise<number> {
    try {
      const { stdout } = await execAsync("top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | awk -F'%' '{print $1}'");
      return parseFloat(stdout.trim()) || 0;
    } catch {
      return 0;
    }
  }

  private parseSize(sizeStr: string): number {
    const units = { K: 1024, M: 1024 ** 2, G: 1024 ** 3, T: 1024 ** 4 };
    const match = sizeStr.match(/^(\d+(?:\.\d+)?)(K|M|G|T)?$/i);
    if (!match) return 0;
    
    const [, size, unit] = match;
    const multiplier = units[unit?.toUpperCase() as keyof typeof units] || 1;
    return Math.round(parseFloat(size) * multiplier);
  }

  getApplicationStats() {
    return {
      startTime: new Date(this.startTime).toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      errorRate: this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0,
      nodeVersion: process.version,
      platform: os.platform(),
      architecture: os.arch()
    };
  }
}