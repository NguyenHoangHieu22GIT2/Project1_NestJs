import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as SchemaType } from 'mongoose';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Schema()
export class Order {
  @Field(() => String)
  _id: string;

  @Field(() => [Product])
  @Prop({
    type: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        images: { type: [String], required: true },
        quantity: { type: Number, required: true },
        discount: { type: Number, required: false },
        _id: { type: mongoose.Types.ObjectId, required: true },
      },
    ],
    _id: false,
  })
  products: [];

  @Field(() => String)
  @Prop({ required: true, ref: 'User' })
  userId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
