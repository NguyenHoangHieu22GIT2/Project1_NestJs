// import { IsString, IsDate } from 'class-validator';
export class CreateMessageDto {
  message: string;
  sender: string;
  date: Date;
  roomId: string;
}
