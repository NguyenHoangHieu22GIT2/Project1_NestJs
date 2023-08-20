import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './entities/message.entity';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { JoinRoomDto } from './dto/join-room.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}
  async findRoom(roomId: string) {
    return this.messageModel.findOne({ roomId });
  }

  async joinRoom(users: string[], joinerId: string) {
    let roomId = '';
    users.sort();
    users.forEach((user, index) => {
      if (index == 0) {
        roomId += user;
      } else roomId += '-' + user;
    });
    const room = await this.findRoom(roomId);
    let usersId = users.map((user) => ({
      _id: user,
    }));
    if (!room) {
      return this.messageModel.create({
        history: [],
        roomId: roomId,
        users: usersId,
      });
    } else {
      if (
        room.notification.userId &&
        room.notification.userId.toString() === joinerId.toString()
      ) {
        room.notification = { quantityOfMessages: 0, userId: '' };
      }
      return room.save();
    }
  }

  async getAllUserInRoom(userId: string): Promise<Partial<User>[]> {
    const rooms = await this.messageModel.find({ 'users._id': userId });
    const promisePopulatedRooms = rooms.map(async (room) => {
      await room.populate({
        path: 'users._id',
        select: 'avatar username isOnline',
      });
      return room;
    });
    const populatedRooms = await Promise.all(promisePopulatedRooms);
    const RoomsObj = populatedRooms.map((room) => room.toObject());
    const result = RoomsObj.map((RoomObj) => {
      const users = RoomObj.users.map((user) => {
        return { ...user._id };
      });
      RoomObj.users = users;
      return RoomObj;
    });
    // console.log(result[0].users);
    const otherUsers = result.map((room) => {
      const userIdentification = room.users.filter(
        (theUser) => theUser._id.toString() !== userId.toString(),
      )[0];
      return userIdentification;
    });
    return otherUsers;
  }

  async sendMessage({ date, roomId, senderId, message }: CreateMessageDto) {
    if (!roomId || !senderId || !message || !date) {
      throw new BadRequestException('No user to talk to!');
    }
    const room = await this.messageModel.findOne({ roomId });
    const theMessage = {
      date,
      message,
      sender: senderId,
    };
    const receiver = room.users.filter(
      (user) => user._id.toString() !== senderId.toString(),
    )[0];
    if (!room) {
      //TODO : Handle bugs if room is not found!
      // throw new BadRequestException("")
    } else {
      room.notification.userId = receiver._id;
      room.notification.quantityOfMessages += 1;
      room.history.push(theMessage);
      await room.save();
      return theMessage;
    }
  }

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
