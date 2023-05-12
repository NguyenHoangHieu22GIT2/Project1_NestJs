import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RemoveProductInput {
  @Field()
  token: string;

  @Field()
  productId: string;

  @Field()
  userId: string;
}
