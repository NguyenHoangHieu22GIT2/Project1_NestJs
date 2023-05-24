import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteProductsResolver } from './favorite-products.resolver';
import { FavoriteProductsService } from './favorite-products.service';

describe('FavoriteProductsResolver', () => {
  let resolver: FavoriteProductsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoriteProductsResolver, FavoriteProductsService],
    }).compile();

    resolver = module.get<FavoriteProductsResolver>(FavoriteProductsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
