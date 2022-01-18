import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CaslModule } from './casl/casl.module';
import AppConfig from './config/app.config';
import DbConfig from './config/database.config';
import CorsConfig from './config/cors.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      // isGlobal: true,
      load: [AppConfig, DbConfig, CorsConfig],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get<string>("database.host", "localhost"),
        port: configService.get<number>("database.port", 3306),
        username: configService.get<string>("database.user", "root"),
        password: configService.get<string>("database.pass", ""),
        database: configService.get<string>("database.name", "test"),
        autoLoadModels: true,
        logging: configService.get<string>("app.environment", "development") === "development" ? console.log : false,
        synchronize: true
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CompaniesModule,
    AuthModule,
    CaslModule
  ],
  controllers: [AppController],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
})
export class AppModule {}
