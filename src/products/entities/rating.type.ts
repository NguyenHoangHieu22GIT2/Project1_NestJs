import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class RatingInput {
  @Field({ description: 'comment' })
  comment: string;

  @Field(() => Int, { description: 'stars' })
  stars: number;

  @Field(() => String, { description: 'ProductId' })
  productId: string;
}

@ObjectType()
export class Rating {
  @Field({ description: 'comment' })
  comment: string;
  @Field(() => Int, { description: 'stars' })
  stars: number;
  @Field({ description: 'userId' })
  userId: string;
  @Field(() => Date, { description: 'Date' })
  createdAt: Date;
}
