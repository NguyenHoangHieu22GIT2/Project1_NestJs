import { Test, TestingModule } from '@nestjs/testing';
import { AuctionProductService } from './auction-product.service';

describe('AuctionProductService', () => {
  let service: AuctionProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuctionProductService],
    }).compile();

    service = module.get<AuctionProductService>(AuctionProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
