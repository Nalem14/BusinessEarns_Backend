import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get configs
  const configService = app.get(ConfigService);

  /**
   * Include plugins
   */
  app.use(helmet());
  app.enableCors({
    origin: configService.get("APP_URL", true)
  });

  /**
   * Swagger
   */
  const config = new DocumentBuilder()
    .setTitle('Business Earn')
    .setDescription('The Business Earn API documentation.')
    .setVersion('1.0')
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" })
    .addServer("http://localhost:3000", "Local dev #1")
    .addServer("http://localhost:44444", "Local dev #2")
    .addServer("http://oneill.orion-serv.fr:44094", "Official Production")
    .addTag("Users", "Interact with your user account")
    .addTag("Companies", "Interact with your user associed companies")
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    }
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, customOptions);

  /**
   * Listen App
   */
  await app.listen(configService.get("APP_PORT", 3000));
}
bootstrap();
