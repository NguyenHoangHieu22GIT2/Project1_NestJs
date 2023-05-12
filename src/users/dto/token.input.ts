import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenInput {
  @Field({ description: 'Insert Token here' })
  token: string;
}
