import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const userDecorator = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const req = GqlExecutionContext.create(context).getContext().req;
    return req.user;
  },
);
