import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageTypeHistory {
  @Field({ description: 'message' })
  message: string;
  @Field({ description: 'Sender' })
  sender: string;
  @Field({ description: 'date' })
  date: Date;
}
