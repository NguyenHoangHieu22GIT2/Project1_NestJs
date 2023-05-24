import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ToggleFavoriteProductInput {
  @Field({ description: 'Product Id' })
  productId: string;

  @Field({ description: 'User Id' })
  userId: string;
}
