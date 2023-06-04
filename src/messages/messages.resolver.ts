import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';
import { Injectable, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthInterceptor } from 'src/users/Interceptor/auth.interceptor';
import { AuthGuard } from 'src/users/auth.guard';
import { userDecorator } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Message)
@Injectable()
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Query(() => [User])
  @UseInterceptors(AuthInterceptor)
  @UseGuards(AuthGuard)
  getAllMessages(@userDecorator() user: User) {
    return this.messagesService.getAllUserInRoom(user._id);
  }
}
