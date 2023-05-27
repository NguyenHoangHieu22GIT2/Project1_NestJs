import { InputType, Int, Field } from '@nestjs/graphql';
import { TagInput, TagType } from '../entities/tags.type';
@InputType()
export class CreateProductInput {
  @Field({ description: 'Title of the product' })
  title: string;
  @Field(() => Int, { description: 'price of the product' })
  price: number;
  @Field({ description: 'description of the product' })
  description: string;
  @Field(() => [String], { nullable: true })
  images: string[];
  @Field({ description: 'CsrfToken' })
  token: string;
  @Field(() => Int, { description: 'Stock' })
  stock: number;
  @Field(() => Int, { description: 'discount', nullable: true })
  discount: number;
  @Field(() => [TagInput], { description: 'Tag Options', nullable: true })
  tags: { name: string; options: string[] }[];
}
