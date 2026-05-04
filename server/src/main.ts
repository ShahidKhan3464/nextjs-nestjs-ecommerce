import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';

async function bootstrap() {
  // 1️⃣ Create Nest app
  const app = await NestFactory.create(AppModule);

  // 2️⃣ Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 3️⃣ Swagger Config
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setVersion('1.0')
    .setTitle('My API')
    .setDescription('API documentation')
    .addServer('http://localhost:3001')
    .build();

  // 4️⃣ Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // 5️⃣ Setup Swagger route
  SwaggerModule.setup('api', app, document);

  // // 6️⃣ Global Interceptors
  // app.useGlobalInterceptors(new DataResponseInterceptor());

  // 6️⃣ Start server
  await app.listen(3001);
}

bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
