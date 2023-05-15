import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ProductsModule } from 'src/products/products.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthResolver } from './auth.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [
    UsersResolver,
    UsersService,
    AuthService,
    JwtService,
    AuthResolver,
  ],
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '60h' },
        };
      },
    }),
    ProductsModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          transport: {
            service: 'gmail',
            auth: {
              user: configService.get<string>('APP_EMAIL_GMAIL'),
              pass: configService.get<string>('APP_PASSWORD_GMAIL'),
            },
          },
        };
      },
    }),
  ],
  exports: [AuthService, UsersService],
})
export class UsersModule {}
