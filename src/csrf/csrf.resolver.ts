import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CsrfService } from './csrf.service';
import { Csrf } from './entities/csrf.entity';
import { CreateCsrfInput } from './dto/create-csrf.input';
import { UpdateCsrfInput } from './dto/update-csrf.input';
import { CheckTokenInput } from './dto/check-token.input';
import { Injectable } from '@nestjs/common';

@Resolver(() => Csrf)
@Injectable()
export class CsrfResolver {
  constructor(private readonly csrfService: CsrfService) {}

  @Mutation(() => Csrf)
  async createCsrfToken(
    @Args('userId', { type: () => String }) userId: string,
  ) {
    const token = await this.csrfService.createToken(userId);
    return token;
  }

  @Query(() => Csrf, { name: 'CheckCsrfToken' })
  checkToken(
    @Args('checkTokenInput', { type: () => CheckTokenInput })
    checkTokenInput: CheckTokenInput,
  ) {
    return this.csrfService.checkToken(
      checkTokenInput.token,
      checkTokenInput.userId,
    );
  }
}
