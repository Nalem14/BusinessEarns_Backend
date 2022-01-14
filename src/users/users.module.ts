import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/auth/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';

@Module({
  imports: [SequelizeModule.forFeature([User]), PassportModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get("APP_KEY", null),
      signOptions: { expiresIn: '30d' },
    }),
    inject: [ConfigService]
  })],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtStrategy, LocalStrategy, ConfigService, CaslAbilityFactory],
  exports: [UsersService],
})
export class UsersModule {}
