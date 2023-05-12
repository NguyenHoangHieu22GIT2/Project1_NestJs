import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as SchemaType } from 'mongoose'
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Schema()
export class Order {
  @Prop({
    type: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        imageUrl: { type: String, required: true },
        quantity: { type: Number, required: true },
        _id: false
      },
    ], _id: false
  })
  products: []

  @Field(() => String)
  @Prop({ required: true, ref: "User" })
  userId: string
}

export const OrderSchema = SchemaFactory.createForClass(Order)
