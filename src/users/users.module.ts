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
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60h' },
    }),
    ProductsModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.APP_EMAIL_GMAIL,
          pass: process.env.APP_PASSWORD_GMAIL,
        },
      },
    }),
  ],
  exports: [AuthService, UsersService],
})
export class UsersModule {}
