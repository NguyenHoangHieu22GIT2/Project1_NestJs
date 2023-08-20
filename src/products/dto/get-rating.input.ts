import { Field, InputType, Int } from '@nestjs/graphql';
@InputType()
export class GetRatingInput {
  @Field({ description: 'productId to find' })
  productId: string;

  @Field(() => Int, { description: 'Limit the rating' , nullable: true })
  limit: number;
  @Field(() => Int, { description: 'Skip the rating' , nullable: true })
  skip: number;

  @Field(() => Int, { description: 'Stars', nullable: true })
  stars: number;
}
