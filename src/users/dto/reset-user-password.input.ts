import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResetPasswordInput {
  @Field({ description: 'userId' })
  userId: string;
  @Field({ description: 'Password' })
  password: string;
  @Field({ description: 'token' })
  token: string;
}
