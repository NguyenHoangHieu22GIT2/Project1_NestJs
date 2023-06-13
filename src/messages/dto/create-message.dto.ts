// import { IsString, IsDate } from 'class-validator';
export class CreateMessageDto {
  message: string;
  senderId: string;
  date: Date;
  roomId: string;
}
