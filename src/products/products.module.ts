import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './entities/product.entity';
import { UsersModule } from 'src/users/users.module';
import { CsrfModule } from 'src/csrf/csrf.module';

@Module({
  providers: [ProductsResolver, ProductsService],
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    forwardRef(() => UsersModule),
    CsrfModule,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
