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
  async create(user: User) {
    if (user.cart.items.length <= 0) {
      throw new BadRequestException('No Cart Item to order');
    }
    const promises = user.cart.items.map(async (item) => {
      const productId = item.productId.toString();
      const product = await this.productService.findById(productId);
      product.quantity = item.quantity;
      console.log(product);
      return product;
    });
    const products = await Promise.all(promises);
    user.clearCart();
    return this.orderModel.create({ products, userId: user._id });
  }

  findAll(user: User) {
    console.log(user);
    return this.orderModel.find({ userId: user._id.toString() });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }
}
