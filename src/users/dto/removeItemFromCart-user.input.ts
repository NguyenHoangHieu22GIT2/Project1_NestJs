import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class RemoveItemFromCartInput {
  @Field({ description: "Product ID" })
  productId: string

  @Field(() => Int, { description: "Quantity" })
  quantity: number
}
