import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { jwtToken as token } from './entities/token.entity';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthInterceptor } from './Interceptor/auth.interceptor';
import { userDecorator } from './decorators/user.decorator';
import { Product } from 'src/products/entities/product.entity';
import { RemoveItemFromCartInput } from './dto/removeItemFromCart-user.input';
import { ResetPasswordInput } from './dto/reset-user-password.input';
import { AddToCartInput } from './dto/add-to-cart.input';
import { GetCartItems } from './dto/get-cart-items.input';

type Token = {
  access_token: string;
};
@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => [User], { name: 'users' })
  findAll(@userDecorator() user: User) {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'userFindById' })
  findById(@Args('id', { type: () => String }) id: string) {
    return this.usersService.findById(id);
  }

  @Query(() => User, { name: 'userFindByEmail' })
  findOne(@Args('email', { type: () => String }) email: string) {
    return this.usersService.findOne(email);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput._id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.usersService.remove(id);
  }

  @Mutation(() => Product)
  @UseInterceptors(AuthInterceptor)
  @UseGuards(AuthGuard)
  addToCart(
    @Args('addToCartInput') addToCartInput: AddToCartInput,
    @userDecorator() user: User,
  ) {
    return this.usersService.addToCart(
      addToCartInput.productId,
      user,
      addToCartInput.token,
    );
  }

  @Query(() => [Product])
  @UseInterceptors(AuthInterceptor)
  @UseGuards(AuthGuard)
  async getCartItems(@userDecorator() user: UserDocument) {
    const fetchedUser = await this.usersService.getCartItems(user);
    const cart = fetchedUser.cart.items;

    const cartItems = cart.map((item) => {
      if (typeof item.productId === 'object') {
        return {
          title: item.productId.title,
          description: item.productId.description,
          price: item.productId.price,
          images: item.productId.images,
          userId: item.productId.userId,
          quantity: item.quantity,
        };
      }
    });
    return cartItems;
  }

  @Mutation(() => Product)
  removeItemFromCart(
    @Args('removeItemFromCartInput', { type: () => RemoveItemFromCartInput })
    input: RemoveItemFromCartInput,
    @userDecorator() user: User,
  ) {
    return this.usersService.removeItemFromCart(
      input.productId,
      input.quantity,
      user,
    );
  }
}
