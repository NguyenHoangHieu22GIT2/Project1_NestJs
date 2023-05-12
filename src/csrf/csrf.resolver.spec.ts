import { Test, TestingModule } from '@nestjs/testing';
import { CsrfResolver } from './csrf.resolver';
import { CsrfService } from './csrf.service';

describe('CsrfResolver', () => {
  let resolver: CsrfResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsrfResolver, CsrfService],
    }).compile();

    resolver = module.get<CsrfResolver>(CsrfResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
