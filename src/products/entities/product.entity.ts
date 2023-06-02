import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Schema as SchemaType } from 'mongoose';
import { TagType } from './tags.type';
import { Rating } from './rating.type';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { User } from 'src/users/entities/user.entity';

export type ProductDocument = HydratedDocument<Product>;
@ObjectType()
@Schema()
export class Product {
  @Field({ description: 'id of the product' })
  _id: string;

  @Field({ description: 'Title of the product' })
  @Prop({ type: String, required: true })
  title: string;

  @Field(() => Int, { description: 'price of the product' })
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

  @Field({ description: 'User', nullable: true })
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

  @Field(() => Int, { description: 'has Sold of the product' })
  @Prop({ required: true, type: Number, default: 0 })
  hasSold: number;
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
