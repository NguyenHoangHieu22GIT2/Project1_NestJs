import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserBid {
  @Field(() => String, { description: 'user Id Has bid in the auction' })
  userId: string;

  @Field(() => Float, { description: 'The money that the user has bid' })
  price: number;
}
