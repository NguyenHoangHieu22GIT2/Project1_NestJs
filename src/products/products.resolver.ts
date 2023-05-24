import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthInterceptor } from 'src/users/Interceptor/auth.interceptor';
import { userDecorator } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/users/auth.guard';
import { RemoveProductInput } from './dto/remove-product.input';
import { ProductFindOptions } from './dto/product-find-options.input';
// import { ProductUnionType } from './union/product.union';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) { }

  @Mutation(() => Product)
  @UseInterceptors(AuthInterceptor)
  @UseGuards(AuthGuard)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @userDecorator() user: User,
  ) {
    return this.productsService.create(createProductInput, user);
  }

  @Query(() => [Product], { name: 'products' })
  async findAll(
    @Args('productFindOptions') productFindOptions: ProductFindOptions,
  ) {
    const product = await this.productsService.find(productFindOptions);
    return product;
  }

  @Query(() => Int, { name: 'countProducts' })
  findNumberOfAllProducts(
    @Args('productFindOptions') productFindOptions: ProductFindOptions,
  ) {
    return this.productsService.findNumberOfAllProducts(productFindOptions);
  }

  @Query(() => [Product], { name: 'findRecommendedProducts' })
  findRecommendedProducts(
    @Args('productFindOptions') productFindOptions: ProductFindOptions,
  ) {
    return this.productsService.findRecommendedProducts(productFindOptions);
  }

  @Query(() => [Product], { name: 'productsOfUser' })
  findProductsOfUser(@userDecorator() user: User) {
    return this.productsService.findAllOfUsers(user);
  }

  @Query(() => Product, { name: 'findProductById' })
  findById(@Args('id', { type: () => String }) id: string) {
    return this.productsService.findById(id);
  }
  @Mutation(() => Product)
  @UseInterceptors(AuthInterceptor)
  @UseGuards(AuthGuard)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @userDecorator() user: User,
  ) {
    return this.productsService.update(updateProductInput, user);
  }

  @Mutation(() => Product)
  @UseInterceptors(AuthInterceptor)
  @UseGuards(AuthGuard)
  removeProduct(
    @Args('removeProductInput', { type: () => RemoveProductInput })
    removeProductInput: RemoveProductInput,
    @userDecorator() user: User,
  ) {
    return this.productsService.remove(removeProductInput, user);
  }

  @Query(() => Product)
  @UseInterceptors(AuthInterceptor)
  @UseGuards(AuthGuard)
  test(@userDecorator() user: User) {
    return this.productsService.getCartItems(user._id);
  }

}
