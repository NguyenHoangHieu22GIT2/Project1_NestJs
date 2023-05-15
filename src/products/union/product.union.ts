import { createUnionType } from '@nestjs/graphql';
import { ErrorHandler } from 'src/type/error.entity';
import { Product } from '../entities/product.entity';

export const LoginUnionResult = createUnionType({
  name: 'LoginUnionResult',
  types: () => [Product, ErrorHandler],
  resolveType: (value) => {
    if ('message' in value) {
      return ErrorHandler;
    } else {
      return Product;
    }
  },
});
