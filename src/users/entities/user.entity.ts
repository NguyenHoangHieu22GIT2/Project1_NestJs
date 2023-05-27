import { BadRequestException } from '@nestjs/common';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaType, Schema as schemaType } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Product } from 'src/products/entities/product.entity';

export type UserDocument = HydratedDocument<User>;

type cartItem = { productId: schemaType.Types.ObjectId; quantity: number };

@ObjectType()
@Schema()
export class User {
  @Field({ description: 'Id of The user' })
  _id: string;

  @Field({ description: 'email of the user' })
  @Prop({ required: true, type: String })
  email: string;

  @Field({ description: 'avatar of the user' })
  @Prop({ required: true, type: String })
  avatar: string;
  @Field({ description: 'password of the user' })
  @Prop({ required: true, type: String })
  password: string;

  @Field({ description: 'username of the user' })
  @Prop({ required: true, type: String })
  username: string;

  @Prop({ required: false, type: String })
  token: string;

  @Prop({ required: false, type: Date })
  tokenDate: Date;

  @Prop({
    type: {
      items: [
        {
          productId: {
            type: schemaType.Types.ObjectId,
            required: true,
            ref: 'Product',
            _id: false,
          },
          quantity: { type: Number, required: true, _id: false },
          _id: false,
        },
      ],
      _id: false,
    },
    required: true,
    default: { items: [] },
  })
  cart: {
    items: {
      productId: string;
      quantity: number;
    }[];
  };

  addToCart: (productId: string) => {};
  removeItemFromCart: (productId: string, quantity: number) => {};
  clearCart: () => {};
}
const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.addToCart = function (productId: string) {
  const productInCart = this.cart.items.find(
    (item: cartItem) => item.productId.toString() === productId.toString(),
  ) as cartItem;
  const productInCartIndex = this.cart.items.findIndex(
    (item: cartItem) => item.productId.toString() === productId.toString(),
  ) as number;
  const cartItems = [...this.cart.items];
  let newQuantity = 1;
  if (productInCartIndex >= 0) {
    productInCart.quantity += newQuantity;
    cartItems[productInCartIndex] = productInCart;
  } else {
    cartItems.push({
      productId: productId,
      quantity: newQuantity,
    });
  }

  this.cart.items = cartItems;
  return this.save();
};

UserSchema.methods.removeItemFromCart = function (
  productId: string,
  quantity: number,
) {
  const productInCart: cartItem = this.cart.items.find((item: cartItem) => {
    return item.productId.toString() === productId.toString();
  });
  const productInCartIndex: number = this.cart.items.findIndex(
    (item: cartItem) => {
      return item.productId.toString() === productId.toString();
    },
  );
  if (productInCartIndex < 0) {
    throw new BadRequestException('No Product found!');
  }
  let calculatedQuantity = productInCart.quantity - quantity;
  let cartItems = [...this.cart.items];
  if (calculatedQuantity <= 0) {
    cartItems = cartItems.filter(
      (item: cartItem) => item.productId.toString() !== productId.toString(),
    );
  } else {
    productInCart.quantity -= quantity;
    cartItems[productInCartIndex] = productInCart;
  }

  this.cart.items = cartItems;

  return this.save();
};

UserSchema.methods.clearCart = function () {
  this.cart.items = [];
  return this.save();
};

export { UserSchema };
