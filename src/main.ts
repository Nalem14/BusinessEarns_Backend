import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import helmet from 'helmet';
import fs from 'fs';
require('dotenv').config();

async function bootstrap() {

  // SSL options
  let httpsOptions = {};
  if(process.env.SSL_KEY && process.env.SSL_CERT) {
    httpsOptions = {
      key: fs.readFileSync(process.env.SSL_KEY),
      cert: fs.readFileSync(process.env.SSL_CERT),
    };
  }

  // create app
  const app = await NestFactory.create(AppModule, { httpsOptions });

  // Get configs
  const configService = app.get(ConfigService);

  /**
   * Include plugins
   */
  app.use(helmet());
  app.enableCors(configService.get("cors", { origin: true }));

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
