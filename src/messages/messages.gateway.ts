import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io';
import { JoinRoomDto } from './dto/join-room.dto';
import { User } from 'src/users/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { SendNotificationDto } from './dto/send-notification.dto';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private connectedUsers: Map<string, Socket> = new Map();

  constructor(
    private readonly messagesService: MessagesService,
    private readonly userService: UsersService,
  ) {}

  async handleConnection(@ConnectedSocket() socket: Socket, ...args: any[]) {
    // console.log('New client connected:', socket.id);
    const userId = socket.handshake.query.userId as string;
    if (userId.toString() !== 'null') {
      const allFriendUsers = await this.messagesService.getAllUserInRoom(
        userId,
      );
      this.connectedUsers.set(userId, socket);
      // await this.userService.updateOnline(userId, true);
      this.connectedUsers.forEach((socket, userIdentification) => {
        allFriendUsers.forEach((user) => {
          if (user._id.toString() === userIdentification.toString()) {
            this.server
              .to(socket.id)
              .emit('userOnline', { userId, isOnline: true });
          }
        });
      });
    }
  }
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    if (userId.toString() !== 'null') {
      const allFriendUsers = await this.messagesService.getAllUserInRoom(
        userId,
      );
      // await this.userService.updateOnline(userId, false);
      this.connectedUsers.delete(userId);
      this.connectedUsers.forEach((socket, userIdentification) => {
        allFriendUsers.forEach((user) => {
          if (user._id.toString() === userIdentification.toString()) {
            this.server
              .to(socket.id)
              .emit('userOffline', { userId, isOnline: false });
          }
        });
      });
    }
  }

  @SubscribeMessage('joinRoomFull')
  async joinRoomFull(
    @MessageBody() joinRoomDto: JoinRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const room = await this.messagesService.joinRoom(
      joinRoomDto.users,
      joinRoomDto.joinerId,
    );
    await room.populate({
      path: 'users._id',
      select: 'username',
    });
    let adjustedRoom = room.toObject();
    const users = adjustedRoom.users.map((user) => {
      return { ...user._id };
    });
    adjustedRoom.users = users;
    // console.log(adjustedRoom.users);
    let i = 0;
    socket.rooms.forEach((room) => {
      //we don't want to leave the socket's personal room which is guaranteed to be first
      if (i !== 0) {
        socket.leave(room);
      }
      i++;
    });
    socket.join(room.roomId);
    socket.emit('sendRoomFull', adjustedRoom);
  }

  @SubscribeMessage('joinRoomLite')
  async joinRoomLite(
    @MessageBody() joinRoomDto: JoinRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const room = await this.messagesService.joinRoom(
      joinRoomDto.users,
      joinRoomDto.joinerId,
    );
    await room.populate({
      path: 'users._id',
      select: 'username',
    });
    let adjustedRoom = room.toObject();
    const users = adjustedRoom.users.map((user) => {
      return { ...user._id };
    });
    adjustedRoom.users = users;
    socket.join(room.roomId);
    socket.emit('sendRoomLite', adjustedRoom);
    // console.log(users);
  }

  @SubscribeMessage('sendMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.sendMessage(createMessageDto);
    this.server.in(createMessageDto.roomId).emit('sendMessage', message);
    // const room = await this.messagesService.findRoom(createMessageDto.roomId);
    // const receiver = room.users.filter(
    //   (user) => user._id.toString() !== createMessageDto.senderId.toString(),
    // )[0];
    // this.connectedUsers.forEach((socket, userIdentification) => {
    // if (receiver._id.toString() === userIdentification.toString()) {
    //     this.server
    //       .to(socket.id)
    //       .emit('sendNotification', { notification: room.notification });
    //   }
    // });
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number) {
    return this.messagesService.findOne(id);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    return this.messagesService.remove(id);
  }
}
