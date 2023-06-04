import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './entities/message.entity';
import { MessagesResolver } from './messages.resolver';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  providers: [MessagesGateway, MessagesService, MessagesResolver],
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    UsersModule,
    UsersModule,
  ],
})
export class MessagesModule {}
