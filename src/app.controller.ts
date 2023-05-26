import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { fstat, unlink, writeFile } from 'fs';
import { randomBytes } from 'crypto';
import { ProductsService } from './products/products.service';
import { UploadFileDto } from './uploadFile.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly productService: ProductsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/uploadFile')
  async uploadFile(@Body() file: UploadFileDto) {
    var data = file.fileBase64.replace(/^data:image\/\w+;base64,/, '');
    const fileBuffer = Buffer.from(data, 'base64');
    const salt = randomBytes(12).toString('hex');
    try {
      if (
        file.mimetype !== 'jpg' &&
        file.mimetype !== 'jpeg' &&
        file.mimetype !== 'png'
      ) {
        throw new BadRequestException('Wrong Image Format!');
      }
      writeFile(
        join(process.cwd(), `./src/upload/${file.fileName}`),
        fileBuffer,
        () => {
          console.log('Done');
        },
      );
      return 'File saved successfully';
    } catch (error: any) {
      unlink(join(process.cwd(), `./src/upload/${file.fileName}`), () => {
        console.log(error);
      });
    }
  }
}
