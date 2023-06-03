import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ToggleVoteInput {
  @Field({ description: 'productId' })
  productId: string;

  @Field({ description: 'ratingId' })
  ratingId: string;
}
