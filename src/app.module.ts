import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';


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
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CompaniesModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
})
export class AppModule {}
