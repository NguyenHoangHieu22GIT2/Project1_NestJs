import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginVerifyToken {
  @Field({ description: 'Token' })
  token: string;
}
