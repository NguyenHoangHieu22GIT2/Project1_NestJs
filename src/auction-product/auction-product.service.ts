import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuctionProductInput } from './dto/create-auction-product.input';
import { UpdateAuctionProductInput } from './dto/update-auction-product.input';
import { InjectModel } from '@nestjs/mongoose';
import { AuctionProduct } from './entities/auction-product.entity';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuctionProductService {
  constructor(
    @InjectModel(AuctionProduct.name)
    private readonly auctionProductSchema: Model<AuctionProduct>,
  ) {}
  create(createAuctionProductInput: CreateAuctionProductInput, user: User) {
    let [day, month, year] = createAuctionProductInput.endOfAuction.split('/');
    const endOfAuction = new Date(+year, +month - 1, +day);
    const date = new Date();

    if (date > endOfAuction) {
      throw new BadRequestException(
        'The date of ending the auction must not be in the past',
      );
    }
    return this.auctionProductSchema.create({
      ...createAuctionProductInput,
      userId: user._id,
      endOfAuction: endOfAuction,
    });
  }

  findAll() {
    return `This action returns all auctionProduct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auctionProduct`;
  }

  update(id: number, updateAuctionProductInput: UpdateAuctionProductInput) {
    return `This action updates a #${id} auctionProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} auctionProduct`;
  }
}
