import { Test, TestingModule } from '@nestjs/testing';
import { AuctionProductResolver } from './auction-product.resolver';
import { AuctionProductService } from './auction-product.service';

describe('AuctionProductResolver', () => {
  let resolver: AuctionProductResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuctionProductResolver, AuctionProductService],
    }).compile();

    resolver = module.get<AuctionProductResolver>(AuctionProductResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
