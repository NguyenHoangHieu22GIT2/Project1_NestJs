import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ErrorHandler {
  @Field({ description: 'A message for the error' })
  message: string;
}
