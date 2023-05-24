import { Injectable } from '@nestjs/common';
import { ToggleFavoriteProductInput } from './dto/toggle-favorite-product.input';
import { InjectModel } from '@nestjs/mongoose';
import { FavoriteProduct } from './entities/favorite-product.entity';
import { Model } from 'mongoose';
import { FindFavoriteProduct } from './dto/find-favorite-product.input';

@Injectable()
export class FavoriteProductsService {
  constructor(
    @InjectModel(FavoriteProduct.name)
    private readonly favoriteProductModel: Model<FavoriteProduct>,
  ) { }

  findAll({ userId, limit, skip }: FindFavoriteProduct) {
    return this.favoriteProductModel.find({ userId }).limit(limit).skip(skip)
  }

  findOne({ productId, userId }: ToggleFavoriteProductInput) {
    return this.favoriteProductModel.findOne({ userId, productId })
  }

  async toggle({ productId, userId }: ToggleFavoriteProductInput) {
    const favorite = await this.favoriteProductModel.findOne({ userId, productId })
    if (favorite) {
      return this.favoriteProductModel.deleteOne({ userId, productId })
    }
    return this.favoriteProductModel.create({
      productId,
      userId
    })
  }


}
