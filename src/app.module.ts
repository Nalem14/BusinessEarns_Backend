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


@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get("DB_HOST", "localhost"),
        port: configService.get("DB_PORT", 3306),
        username: configService.get("DB_USER", "root"),
        password: configService.get("DB_PASS", ""),
        database: configService.get("DB_NAME", "test"),
        autoLoadModels: true,
        logging: configService.get("APP_ENV", "development") === "development" ? console.log : false,
        synchronize: configService.get("APP_ENV", "development") === "development" ? true : false
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
