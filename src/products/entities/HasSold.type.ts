import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HasSold {
  @Field(() => String, { description: 'User Id' })
  userId: string;

  @Field(() => Date, { description: 'Date' })
  date: Date;   

  @Field(() => Number, { description: 'quantity' })
  quantity: number;
}
