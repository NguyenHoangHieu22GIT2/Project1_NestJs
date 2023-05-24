import { createUnionType } from '@nestjs/graphql';
import { ErrorHandler } from 'src/type/error.entity';
import { jwtToken } from '../entities/token.entity';
import { User } from '../entities/user.entity';

export const UserUnionResult = createUnionType({
  name: 'UserUnionResult',
  types: () => [User, ErrorHandler],
  resolveType: (value) => {
    if ('message' in value) {
      return ErrorHandler;
    } else {
      return User;
    }
  },
});
