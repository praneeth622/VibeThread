import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Serve static files
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  
  // Enable CORS with specific origins
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', 
      'https://vibethread.praneethd.xyz',
      'https://vibethread-backend.praneethd.xyz'
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('VibeThread API')
    .setDescription('API for VibeThread - Audio processing and thread generation')
    .setVersion('1.0')
    .addTag('audio', 'Audio processing endpoints')
    .addTag('monitoring', 'System monitoring endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  logger.log(`🚀 VibeThread Backend is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  logger.log(`📊 Monitoring Dashboard: http://localhost:${port}/api/monitoring/dashboard`);
  logger.log(`🔍 Health Check: http://localhost:${port}/api/audio/health`);
}
bootstrap();