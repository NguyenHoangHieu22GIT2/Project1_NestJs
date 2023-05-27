import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { LoginVerifyToken } from './dto/login-verify-token.input';
import { GraphQLError } from 'graphql';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly nodemailer: MailerService,
  ) {}

  async validate(token: string) {
    if (token && token.length > 0)
      return this.jwtService
        .verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        })
        .catch((error: GraphQLError) => {
          throw new BadRequestException(error.message);
        });
    else throw new BadRequestException('Wrong Token');
  }

  async signup({ email, password, username, avatar }: CreateUserInput) {
    const user = await this.usersService.findOne(email);
    if (user) {
      throw new BadRequestException('User already existed!!!');
    }
    let token = Math.ceil(Math.random() * 10000);
    if (token <= 1000) {
      token += 1000;
    }
    const hashedPassword = await bcrypt.hash(
      password,
      +process.env.BCRYPT_HASH,
    );
    this.nodemailer.sendMail({
      from: 'hoanghieufro@gmail.com',
      to: email,
      subject: 'Thank you for trusting our service!',
      html: `<h1>Welcome abroad</h1> 
      <h3>I as the CEO of K-rose, want to thank you for joining one of the best company about selling in the world, suit yourself and let's have the best deal ever<h3>
      <p>Of course, just to make sure, The time you logged in the first time, you will have to use a token that I will provide to you to prove that you are a real user and not just some crap dude out there.</p>
      <code>${token}</code>
      `,
    });
    return this.usersService.create({
      email,
      avatar,
      password: hashedPassword,
      username,
      token: token.toString(),
    });
  }

  async signin({ email, password }: LoginUserInput) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new BadRequestException("User doesn't exist, please create one!");
    }
    console.log(user.token);
    if (user.token) {
      return {
        message:
          'You Have To Enter the token here first to activate your account! Okay?',
      };
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) {
      throw new UnauthorizedException("Credentials don't meet my boy");
    }
    const payload = { email, _id: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
      userId: user._id,
      email: user.email,
      avatar: user.avatar,
      username: user.username,
    };
  }

  async verifyTokenNewUser(loginVerifyToken: LoginVerifyToken) {
    console.log('Hello World');
    const user = await this.usersService.findByToken(loginVerifyToken.token);
    user.token = undefined;
    if (!user) {
      throw new UnauthorizedException('Wrong Token');
    }

    return user.save();
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new BadRequestException("User doesn't exist");
    }
    const token = randomBytes(32).toString('hex');
    user.token = token;
    const tokenExpiration = new Date();
    tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 10);
    user.tokenDate = tokenExpiration;
    this.nodemailer.sendMail({
      from: 'hoanghieufro@gmail.com',
      to: email,
      subject: 'Forgot password Already?',
      html: `<h1>Since you forgot your password, I will give you a chance to be reborn</h1>
  <p>Click this:<a href="${process.env.DEVELOPMENT_LINK}/auth/reset-password/${user._id}">link</a> to reset with this token: ${token}</p>
`,
    });
    user.save();
    return user;
  }

  async resetPassword(userId: string, password: string, token: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException("User doesn't exist");
    }
    if (user.token !== token) {
      throw new BadRequestException('Wrong Token brother...');
    }
    user.token = undefined;
    user.tokenDate = undefined;
    user.password = await bcrypt.hash(password, process.env.BCRYPT_HASH);
    return user.save();
  }
}
