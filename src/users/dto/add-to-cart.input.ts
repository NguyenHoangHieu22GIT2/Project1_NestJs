import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddToCartInput {
  @Field({ description: 'Token' })
  token: string;
  @Field({ description: 'Product Id' })
  productId: string;
}
