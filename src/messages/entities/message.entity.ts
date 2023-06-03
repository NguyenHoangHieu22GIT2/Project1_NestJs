import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { MessageTypeHistory } from '../types/message.type.history';
import { Field, ObjectType } from '@nestjs/graphql';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
@ObjectType()
export class Message {
  @Field({ description: 'Room Id' })
  @Prop({ required: true })
  roomId: string;

  @Field(() => User, { description: 'Users array' })
  @Prop({
    required: true,
    type: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
          _id: false,
        },
      },
    ],
  })
  users: { _id: string; username: string }[] | User[];
  @Field(() => MessageTypeHistory, {
    description: 'History of the conversation',
  })
  @Prop({
    required: true,
    type: [
      {
        message: {
          type: String,
          required: true,
        },
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
        date: {
          type: Date,
          required: true,
        },
      },
    ],
    default: [],
  })
  history: MessageTypeHistory[];
}
export const MessageSchema = SchemaFactory.createForClass(Message);
