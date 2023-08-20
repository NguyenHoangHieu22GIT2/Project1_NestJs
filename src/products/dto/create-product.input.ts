import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { OptionsType } from '../entities/options.type';
@InputType()
export class CreateProductInput {
  @Field({ description: 'Title of the product' })
  title: string;
  @Field(() => Float, { description: 'price of the product' })
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
  @Field(() => [OptionsType], { description: 'Tag Options', nullable: true })
  options: OptionsType[];
  // @Field(() => String, { description: 'Type Of Product' })
  // typeOfProduct: string;
}
