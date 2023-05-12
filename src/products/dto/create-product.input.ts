import { InputType, Int, Field } from '@nestjs/graphql';
@InputType()
export class CreateProductInput {
  @Field({ description: 'Title of the product' })
  title: string;
  @Field(() => Int, { description: 'price of the product' })
  price: number;
  @Field({ description: 'description of the product' })
  description: string;
  @Field(() => String)
  imageUrl: string;
  @Field({ description: 'CsrfToken' })
  token: string;
}
