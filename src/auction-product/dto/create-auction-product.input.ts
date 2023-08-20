import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { Schema as SchemaType } from 'mongoose';

@InputType()
export class CreateAuctionProductInput {
  @Field({ description: 'Title of the product' })
  title: string;

  @Field(() => Float, { description: 'price of the product' })
  price: number;

  @Field({ description: 'description of the product' })
  description: string;

  @Field(() => [String])
  images: string[];

  @Field(() => String, { description: 'End Of the auction', nullable: true })
  endOfAuction: string;
}
