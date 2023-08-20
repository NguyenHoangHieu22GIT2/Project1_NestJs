import { createUnionType } from '@nestjs/graphql';
import { ErrorHandler } from '../../type/error.entity';
import { jwtToken } from '../entities/token.entity';

export const LoginUnionResult = createUnionType({
  name: 'LoginUnionResult',
  types: () => [jwtToken, ErrorHandler],
  resolveType: (value) => {
    if ('message' in value) {
      return ErrorHandler;
    } else {
      return jwtToken;
    }
  },
});
