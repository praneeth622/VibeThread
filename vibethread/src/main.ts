import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with more permissive settings
  app.enableCors({
    origin: true, // Allow all origins in development
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Accept,Authorization,Access-Control-Allow-Origin',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('VibeThread API')
    .setDescription('API for VibeThread - Audio processing and thread generation')
    .setVersion('1.0')
    .addTag('audio', 'Audio processing endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();