import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class FavoriteProduct {
  @Field({ description: 'Product Id' })
  productId: string;

  @Field({ description: 'UserId' })
  userId: string;
}

const FavoriteProductSchema = SchemaFactory.createForClass(FavoriteProduct);

export { FavoriteProductSchema };
