import { OptionsType } from '../entities/options.type';
import { CreateProductInput } from './create-product.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field({ nullable: false, description: 'Id of the product' })
  _id: string;
  @Field({ nullable: true, description: 'Title of the product' })
  title: string;
  // @Field(() => Int, { nullable: true, description: 'price of the product' })
  // price: number;
  @Field({ nullable: true, description: 'description of the product' })
  description: string;
  @Field(() => [String], {
    nullable: true,
    description: 'images of the product',
  })
  images: string[];
  @Field({ description: 'CsrfToken' })
  token: string;
  @Field(() => Int, { description: 'Stock', nullable: true })
  stock: number;
  @Field(() => Int, { description: 'discount', nullable: true })
  discount: number;
  @Field(() => [OptionsType], { description: 'Options', nullable: true })
  options?: OptionsType[];
  // @Field(() => String, { description: 'Type Of Product', nullable: true })
  // typeOfProduct: string;
}
