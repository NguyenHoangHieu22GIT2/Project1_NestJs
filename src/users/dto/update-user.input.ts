import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field({ description: 'ID' })
  _id: string;
  @Field({ description: 'email', nullable: true })
  email: string;

  @Field({ description: 'password', nullable: true })
  password: string;

  @Field({ description: 'username', nullable: true })
  username: string;
}
