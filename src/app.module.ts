import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CsrfModule } from './csrf/csrf.module';
import { ConfigModule } from '@nestjs/config';
import { FavoriteProductsModule } from './favorite-products/favorite-products.module';
import { MulterModule } from '@nestjs/platform-express';
import { MessagesModule } from './messages/messages.module';
import { AuctionProductModule } from './auction-product/auction-product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.credentials.env',
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      cors: {
        credentials: true,
        origin: true,
      },
    }),
    MongooseModule.forRoot(process.env.DATABASE_URI, {
      dbName: process.env.DATABASE_NAME,
    }),
    MulterModule.register({
      dest: './files',
    }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    CsrfModule,
    FavoriteProductsModule,
    MessagesModule,
    AuctionProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
