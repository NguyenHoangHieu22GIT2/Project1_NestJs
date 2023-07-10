import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { userDecorator } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Injectable, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthInterceptor } from 'src/users/Interceptor/auth.interceptor';
import { AuthGuard } from 'src/users/auth.guard';

@Resolver(() => Order)
@UseInterceptors(AuthInterceptor)
@UseGuards(AuthGuard)
@Injectable()
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order)
  createOrder(@userDecorator() user: User) {
    return this.ordersService.create(user);
  }

  @Query(() => [Order], { name: 'orders' })
  async findAll(@userDecorator() user: User) {
    const orders = await this.ordersService.findAll(user);
    console.log(orders);
    return orders;
  }

  // @Query(() => Order, { name: 'order' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.ordersService.findOne(id);
  // }
}
