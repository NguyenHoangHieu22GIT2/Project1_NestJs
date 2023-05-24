import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class ErrorHandler {
  @Field({ description: 'A message for the error' })
  message: string;
}
