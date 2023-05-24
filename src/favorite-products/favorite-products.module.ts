import { Module } from '@nestjs/common';
import { FavoriteProductsService } from './favorite-products.service';
import { FavoriteProductsResolver } from './favorite-products.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoriteProduct, FavoriteProductSchema } from './entities/favorite-product.entity';

@Module({
  providers: [FavoriteProductsResolver, FavoriteProductsService],
  imports: [
    MongooseModule.forFeature([
      { name: FavoriteProduct.name, schema: FavoriteProductSchema },
    ]),
  ],
})
export class FavoriteProductsModule { }
