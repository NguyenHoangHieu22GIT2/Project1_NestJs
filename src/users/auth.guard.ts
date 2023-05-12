import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

interface modifiedRequest extends Request {
  token: string;
  headers: any;
  body: any;
}

export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = GqlExecutionContext.create(context).getContext()
      .req as modifiedRequest;
    req.token = req.headers.authorization;
    if (
      req.body.operationName === 'login' ||
      req.body.operationName === 'register'
    ) {
      return true;
    }
    return req.token && req.token.length > 0;
  }
}
