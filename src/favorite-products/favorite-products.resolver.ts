import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FavoriteProductsService } from './favorite-products.service';
import { FavoriteProduct } from './entities/favorite-product.entity';
import { ToggleFavoriteProductInput } from './dto/toggle-favorite-product.input';
import { FindFavoriteProduct } from './dto/find-favorite-product.input';
import { Injectable } from '@nestjs/common';

@Resolver(() => FavoriteProduct)
@Injectable()
export class FavoriteProductsResolver {
  constructor(private readonly favoriteProductsService: FavoriteProductsService) { }

  @Mutation(() => FavoriteProduct)
  toggleFavoriteProduct(@Args('toggleFavoriteProductInput') toggleFavoriteProductInput: ToggleFavoriteProductInput) {
    return this.favoriteProductsService.toggle(toggleFavoriteProductInput);
  }

  @Query(() => [FavoriteProduct], { name: 'favoriteProducts' })
  findAll(@Args("findFavoriteProduct") findFavoriteProduct: FindFavoriteProduct) {
    return this.favoriteProductsService.findAll(findFavoriteProduct);
  }

  @Query(() => FavoriteProduct, { name: 'favoriteProduct' })
  findOne(@Args('toggleFavoriteProductInput') toggleFavoriteProductInput: ToggleFavoriteProductInput) {
    return this.favoriteProductsService.findOne(toggleFavoriteProductInput);
  }

}
