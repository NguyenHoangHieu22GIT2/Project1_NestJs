import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuctionProductService } from './auction-product.service';
import { AuctionProduct } from './entities/auction-product.entity';
import { CreateAuctionProductInput } from './dto/create-auction-product.input';
import { UpdateAuctionProductInput } from './dto/update-auction-product.input';
import { Injectable, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthInterceptor } from 'src/users/Interceptor/auth.interceptor';
import { AuthGuard } from 'src/users/auth.guard';
import { userDecorator } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => AuctionProduct)
@UseInterceptors(AuthInterceptor)
@UseGuards(AuthGuard)
@Injectable()
export class AuctionProductResolver {
  constructor(private readonly auctionProductService: AuctionProductService) {}

  @Mutation(() => AuctionProduct)
  async createAuctionProduct(
    @userDecorator() user: User,
    @Args('createAuctionProductInput', {
      type: () => CreateAuctionProductInput,
    })
    createAuctionProductInput: CreateAuctionProductInput,
  ) {
    const result = await this.auctionProductService.create(
      createAuctionProductInput,
      user,
    );
    return result;
  }
}

// Guard -> Interceptor -> Pipe -> controller -> service -> controller -> Interceptor -> output
