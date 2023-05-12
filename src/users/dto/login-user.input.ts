import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginUserInput {
  @Field({ description: 'Email' })
  email: string;

  @Field({ description: 'password' })
  password: string;
}
