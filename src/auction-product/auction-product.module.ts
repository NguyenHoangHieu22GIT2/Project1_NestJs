import { Module } from '@nestjs/common';
import { AuctionProductService } from './auction-product.service';
import { AuctionProductResolver } from './auction-product.resolver';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionProductSchema } from './entities/auction-product.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [AuctionProductResolver, AuctionProductService],
  imports: [
    MongooseModule.forFeature([
      { name: 'AuctionProduct', schema: AuctionProductSchema },
    ]),
    UsersModule,
  ],
})
export class AuctionProductModule {}
