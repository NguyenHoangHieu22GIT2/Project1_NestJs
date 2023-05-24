import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteProductsService } from './favorite-products.service';

describe('FavoriteProductsService', () => {
  let service: FavoriteProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoriteProductsService],
    }).compile();

    service = module.get<FavoriteProductsService>(FavoriteProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
