import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateOrderInput } from './dto/create-order.input';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly productService: ProductsService,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}
  async create(date: Date, user: User) {
    if (user.cart.items.length <= 0) {
      throw new BadRequestException('No Cart Item to order');
    }
    const promises = user.cart.items.map(async (item) => {
      const productId = item.productId.toString();
      const product = await this.productService.findById(productId);
      product.quantity = item.quantity;
      return product;
    });
    const products = await Promise.all(promises);
    user.clearCart();
    products.forEach(async (product) => {
      await this.productService.addHasSold(
        product._id,
        date,
        product.quantity,
        user,
      );
      product.stock -= product.quantity;
      await product.save();
    });
    return this.orderModel.create({ products, userId: user._id, date: date });
  }

  findAll(user: User) {
    return this.orderModel.find({ userId: user._id });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }
}
