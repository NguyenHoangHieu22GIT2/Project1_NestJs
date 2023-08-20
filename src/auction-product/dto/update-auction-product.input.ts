import { Prop } from '@nestjs/mongoose';
import { CreateAuctionProductInput } from './create-auction-product.input';
import { InputType, Field, Int, PartialType, Float } from '@nestjs/graphql';
import { Schema as SchemaType } from 'mongoose';

@InputType()
export class UpdateAuctionProductInput extends PartialType(
  CreateAuctionProductInput,
) {
  @Field({ description: 'Title of the product' })
  title: string;

  @Field(() => Float, { description: 'price of the product' })
  price: number;

  @Field({ description: 'description of the product' })
  description: string;

  @Field(() => [String])
  images: string[];

  @Field({ description: 'user Id' })
  userId: string;

  // @Field(() => Date, { description: 'End Of the auction', nullable: true })
  // @Prop({ type: Date, required: false })
  // endOfAuction: Date;
}
