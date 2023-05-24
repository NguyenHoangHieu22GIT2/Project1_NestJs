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
    }),
    MongooseModule.forRoot(process.env.DATABASE_URI, {
      dbName: process.env.DATABASE_NAME,
    }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    CsrfModule,
    FavoriteProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
