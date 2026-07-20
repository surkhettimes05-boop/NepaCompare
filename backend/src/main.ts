import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const isProduction = process.env.NODE_ENV === 'production';
  const allowedOrigins = [
    'https://nepacompare.com',
    'https://www.nepacompare.com',
    'https://crm.nepacompare.com',
    'https://nepa-compare.vercel.app'
  ];

  if (!isProduction) {
    allowedOrigins.push('http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173');
  }

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`Backend running on port ${port}`);
}
bootstrap();
