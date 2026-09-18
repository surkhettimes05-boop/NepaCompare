import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

function parseCookies(rawCookieHeader?: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!rawCookieHeader) {
    return result;
  }

  for (const part of rawCookieHeader.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = decodeURIComponent(trimmed.slice(separatorIndex + 1).trim());
    result[key] = value;
  }

  return result;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    res.setHeader('X-Powered-By', 'Khaacho');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self';",
    );
    next();
  });

  app.use((req: any, res: any, next: () => void) => {
    const method = req.method || 'GET';
    const cookies = parseCookies(req.headers.cookie as string | undefined);
    const hasSessionCookie = Boolean(cookies.access_token || cookies.session);

    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS' || !hasSessionCookie) {
      return next();
    }

    const csrfCookie = cookies.csrf_token;
    const csrfHeader = req.headers['x-csrf-token'];

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return res.status(403).json({ message: 'CSRF validation failed' });
    }

    return next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Khaacho API')
    .setDescription('REST API documentation for the Khaacho insurance distribution platform.')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
    }, 'JWT-auth')
    .addApiKey({
      type: 'apiKey',
      name: 'Idempotency-Key',
      in: 'header',
    }, 'Idempotency-Key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Khaacho API Docs',
    customCss: '.swagger-ui .topbar { display: none; }',
  });

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
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`Backend running on port ${port}`);
}
bootstrap();
