import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('TRIAD API')
    .setDescription('Documentação da API do sistema TRIAD')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'Informe o token JWT',
      },
      'Bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  document.tags = [
    { name: 'auth', description: 'Endpoints de autenticação' },
    { name: 'users', description: 'Endpoints de usuários' },
    { name: 'events', description: 'Endpoints de eventos' },
    { name: 'Staff Members', description: 'Endpoints de staff members' },
    {
      name: 'Event Staff',
      description: 'Endpoints de vínculo entre evento e staff',
    },
  ];

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
