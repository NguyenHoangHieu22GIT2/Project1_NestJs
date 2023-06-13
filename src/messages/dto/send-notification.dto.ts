import { IsString } from 'class-validator';

export class SendNotificationDto {
  @IsString()
  senderId: string;

  @IsString()
  roomId: string;
}
