import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Mongoose, Schema as SchemaType } from 'mongoose';
import { UserBid } from './UserBid.type';

@ObjectType()
@Schema({ timestamps: true })
export class AuctionProduct {
  @Field(() => String, { description: 'Product Id' })
  _id: string;

  @Field({ description: 'Title of the product' })
  @Prop({ type: String, required: true })
  title: string;

  @Field(() => Float, { description: 'price of the product' })
  @Prop({ type: Number, required: true })
  price: number;

  @Field({ description: 'description of the product' })
  @Prop({ type: String, required: true })
  description: string;

  @Field(() => [String], { description: 'Images of the product' })
  @Prop({ type: [String], required: true })
  images: string[];

  @Field(() => String, { description: 'user Id' })
  @Prop({ type: SchemaType.Types.ObjectId, required: true, ref: 'User' })
  userId: string;

  // @Field(() => String, { description: 'type of Product' })
  // @Prop({ type: String, required: true })
  // typeOfProduct: string;

  @Field(() => String, { description: 'End Of the auction' })
  @Prop({ type: Date, required: true })
  endOfAuction: Date;

  @Field(() => [UserBid], {
    description: 'List of user Has bid in the auction',
  })
  @Prop({
    type: [
      {
        userId: {
          type: String,
          required: true,
          ref: 'User',
          _id: false,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    _id: false,
    default: [],
  })
  listOfUsersBid: UserBid[];
}

const AuctionProductSchema = SchemaFactory.createForClass(AuctionProduct);

export { AuctionProductSchema };
