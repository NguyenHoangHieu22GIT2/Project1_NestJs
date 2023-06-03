import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { jwtToken as token } from './entities/token.entity';
import { ResetPasswordInput } from './dto/reset-user-password.input';
import { userDecorator } from './decorators/user.decorator';
import { LoginVerifyToken } from './dto/login-verify-token.input';
import { LoginUnionResult } from './union/login.union';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  register(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.signup(createUserInput);
  }

  @Query(() => LoginUnionResult)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    const loginInfo = await this.authService.signin(loginUserInput);
    return loginInfo;
  }

  @Query(() => User)
  verifyToken(@Args('loginVerifyToken') loginVerifyToken: LoginVerifyToken) {
    return this.authService.verifyTokenNewUser(loginVerifyToken);
  }

  @Query(() => User)
  forgetPassword(@Args('email', { type: () => String }) email: string) {
    return this.authService.forgotPassword(email);
  }

  @Mutation(() => User)
  resetPassword(
    @Args('resetPasswordInput', { type: () => ResetPasswordInput })
    { userId, password, token }: ResetPasswordInput,
  ) {
    return this.authService.resetPassword(userId, password, token);
  }

  @Query(() => User, { name: 'CheckJwtToken' })
  async checkToken(@Args('token', { type: () => String }) token: string) {
    const infos = await this.authService.validate(token);
    return infos;
  }
}
