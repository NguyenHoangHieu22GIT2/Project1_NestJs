import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Injectable, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthInterceptor } from 'src/users/Interceptor/auth.interceptor';
import { userDecorator } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/users/auth.guard';
import { RemoveProductInput } from './dto/remove-product.input';
import { ProductFindOptions } from './dto/product-find-options.input';
import { CreateRatingInput } from './dto/create-rating.input';
import { Rating } from './entities/rating.type';
import { GetRatingInput } from './dto/get-rating.input';
import { ToggleVoteInput } from './dto/toggle-vote.input';
import { getLatestCreatedRating, getRating } from 'src/utils/ratingHelper';

@Resolver(() => Product)
@Injectable()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  @UseInterceptors(AuthInterceptor)
  @UseGuards(AuthGuard)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @userDecorator() user: User,
  ) {
    const result = await this.productsService.create(createProductInput, user);
    return result;
  }

  @Mutation(() => Rating, { name: 'AddRating' })
  @UseInterceptors(AuthInterceptor)
  @UseGuards(AuthGuard)
  async rating(
    @Args('createRatingInput') ratingInput: CreateRatingInput,
    @userDecorator() user: User,
  ) {
    const ratings = (
      await this.productsService.addRating(ratingInput, user)
    ).toObject().ratings;
    let rating: Rating[];
    let date: Date;
    ratings.forEach((curRating, index) => {
      if (typeof curRating.userId == 'object') {
        if (!date && curRating.userId._id.toString() === user._id.toString()) {
          date = curRating.createdAt;
        }
        if (
          date &&
          date.getTime() < curRating.createdAt.getTime() &&
          curRating.userId._id.toString() === user._id.toString()
        ) {
          date = curRating.createdAt;
        }
      }
    });
    rating = ratings.filter((rating) => {
      if (date.getTime() === rating.createdAt.getTime()) {
        return rating;
      }
    });
    rating[0].userId = JSON.stringify(rating[0].userId);
    return rating[0];
  }

  @Query(() => [Rating])
  async getRatings(
    @Args('getRatingInput', { type: () => GetRatingInput })
    getRatingInput: GetRatingInput,
  ) {
    const ratings = (
      await this.productsService.getRatings(getRatingInput)
    ).toObject().ratings;

    const result = ratings.map((rating, index) => {
      rating.userId = JSON.stringify(rating.userId);
      return rating;
    });
    result.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    return result;
  }

  @Mutation(() => Rating)
  @UseInterceptors(AuthInterceptor)
  @UseGuards(AuthGuard)
  async toggleUpvote(
    @Args('toggleUpvoteInput') toggleUpvoteInput: ToggleVoteInput,
    @userDecorator() user: User,
  ) {
    const ratings = (
      await this.productsService.toggleUpvoteRating(toggleUpvoteInput, user)
    ).toObject().ratings;
    let rating: Rating = ratings.find(
      (rating) =>
        rating._id.toString() === toggleUpvoteInput.ratingId.toString(),
    );
    rating.userId = JSON.stringify(rating.userId);

    return rating;
  }
  @Mutation(() => Rating)
  @UseInterceptors(AuthInterceptor)
  @UseGuards(AuthGuard)
  async toggleDownvote(
    @Args('toggleDownvoteInput') toggleDownvoteInput: ToggleVoteInput,
    @userDecorator() user: User,
  ) {
    const ratings = (
      await this.productsService.toggleDownvoteRating(toggleDownvoteInput, user)
    ).toObject().ratings;
    let rating: Rating = ratings.find(
      (rating) =>
        rating._id.toString() === toggleDownvoteInput.ratingId.toString(),
    );
    rating.userId = JSON.stringify(rating.userId);
    return rating;
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
  async findById(@Args('id', { type: () => String }) id: string) {
    const product = (await this.productsService.findById(id)).toObject();
    if (typeof product.userId === 'object') {
      product.user = product.userId;

      product.userId = product.user._id;
    }
    return product;
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
