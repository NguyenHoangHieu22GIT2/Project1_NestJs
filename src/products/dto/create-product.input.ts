import { InputType, Int, Field } from '@nestjs/graphql';
@InputType()
export class CreateProductInput {
  @Field({ description: 'Title of the product' })
  title: string;
  @Field(() => Int, { description: 'price of the product' })
  price: number;
  @Field({ description: 'description of the product' })
  description: string;
  @Field({ description: "The Image Url" })
  imageUrl: string;
  @Field({ description: 'CsrfToken' })
  token: string;
  @Field(() => Int, { description: "Stock" })
  stock: number;
  @Field(() => Int, { description: "discount" })
  discount: number;
  // @Field(() => ({
  //   name: String,
  //   options: String
  // }), { description: "Tags" })
  // tags: TagType[]
  // @Field(() => [String], { description: "Tag Names" })
  // tagNames: string[]
  // @Field(() => [String], { description: "tagOptions" })
  // tagOptions: string[]
}
