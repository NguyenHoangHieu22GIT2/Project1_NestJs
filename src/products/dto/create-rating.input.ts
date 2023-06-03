import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateRatingInput {
  @Field({ description: 'the product to rate' })
  productId: string;

  @Field({ description: 'The title of the rating' })
  title: string;

  @Field({ description: 'The rating' })
  rating: string;

  @Field(() => Int, { description: 'The star' })
  stars: number;
}
