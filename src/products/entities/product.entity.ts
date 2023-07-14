import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Schema as SchemaType } from 'mongoose';
import { Rating } from './rating.type';
import { User } from 'src/users/entities/user.entity';
import { HasSold } from './HasSold.type';

export type ProductDocument = HydratedDocument<Product>;
@ObjectType()
@Schema()
export class Product {
  @Field({ description: 'id of the product' })
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

  @Field(() => [String])
  @Prop({ type: [String], required: true })
  images: string[];

  @Field({ description: 'user Id' })
  @Prop({ type: SchemaType.Types.ObjectId, required: true, ref: 'User' })
  userId: string;

  @Field(() => User, { description: 'User', nullable: true })
  user: User;

  @Field(() => Int, { description: 'Quantity of the product', nullable: true })
  @Prop({ required: false, type: Number })
  quantity: number;

  @Field(() => [Rating], {
    description: 'Rating of a product',
    nullable: true,
  })
  @Prop({
    required: true,
    type: [
      {
        userId: {
          type: SchemaType.Types.ObjectId,
          required: true,
          ref: 'User',
          _id: false,
        },
        rating: {
          type: String,
          required: true,
          _id: false,
        },
        title: {
          type: String,
          required: true,
          _id: false,
        },
        stars: {
          type: Number,
          required: true,
          _id: false,
        },
        createdAt: {
          type: Date,
          required: true,
          _id: false,
        },
        upvote: [
          {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
          },
        ],
        downvote: [
          {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
          },
        ],
      },
    ],
    default: [],
  })
  ratings: Rating[];

  @Field(() => Int, { description: 'Stock of the products' })
  @Prop({ required: true, type: Number, default: 0 })
  stock: number;

  @Field(() => Int, { description: 'discount of the product' })
  @Prop({ required: true, type: Number, default: 0 })
  discount: number;

  @Field(() => [HasSold], {
    description: 'has Sold of the product',
    defaultValue: [],
  })
  @Prop({
    required: true,
    type: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: 'User',
        },
        date: {
          type: Date,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  })
  hasSold: HasSold[];
  // @Field(() => [TagType])
  // @Prop({
  //   type: [
  //     {
  //       name: {
  //         type: String,
  //         required: true,
  //         _id: false,
  //       },
  //       options: {
  //         type: [String],
  //         required: true,
  //         _id: false,
  //       },
  //     },
  //   ],
  //   required: false,
  //   default: [],
  // })
  // options: [];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ title: 'text', description: 'text' });
