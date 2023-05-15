import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class Product {
  @Field(() => String, { description: 'id of the product' })
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

  @Field({ description: 'image of the product' })
  @Prop({ type: String, required: true })
  imageUrl: string;

  @Field({ description: 'user Id' })
  @Prop({ type: String, required: true })
  userId: string;

  @Field(() => Int, { description: 'Quantity of the product', nullable: true })
  @Prop({ required: false, type: Number })
  quantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ title: 'text', description: 'text' });
