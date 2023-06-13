import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const req = GqlExecutionContext.create(context).getContext().req;

    const token = req.token.split(' ')[1];
    const payload = await this.authService.validate(token);
    const user = await this.usersService.findById(payload._id);

    req.user = user;
    return next.handle();
  }
}
