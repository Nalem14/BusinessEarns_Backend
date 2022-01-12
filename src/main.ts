import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.enableCors({
    origin: configService.get("APP_URL", true)
  });

  const config = new DocumentBuilder()
    .setTitle('Business Earn')
    .setDescription('The Business Earn API documentation.')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    }
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, customOptions);

  await app.listen(configService.get("APP_PORT", 3000));
}
bootstrap();
