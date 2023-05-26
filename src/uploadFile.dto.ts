import { IsString } from 'class-validator';

export class UploadFileDto {
  @IsString()
  fileName: string;
  @IsString()
  fileBase64: string;
  @IsString()
  mimetype: string;
}
