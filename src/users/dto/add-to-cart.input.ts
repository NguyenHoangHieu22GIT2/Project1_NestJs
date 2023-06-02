import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddToCartInput {
  @Field({ description: 'Product Id' })
  productId: string;
  @Field({ description: 'Quantity' })
  quantity: number;
}
