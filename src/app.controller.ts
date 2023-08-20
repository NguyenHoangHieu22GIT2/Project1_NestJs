import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { fstat, unlink, writeFile } from 'fs';
import { randomBytes } from 'crypto';
import { ProductsService } from './products/products.service';
import { UploadFileDto } from './uploadFile.dto';
import { faker } from '@faker-js/faker';
import { AuthService } from './users/auth.service';

// const editFileName = (req, file, callback) => {
//   const name = file.originalname.split('.')[0];
//   const fileExtName = extname(file.originalname);
//   const randomName = Array(4)
//     .fill(null)
//     .map(() => Math.round(Math.random() * 16).toString(16))
//     .join('');
//   callback(null, `${name}-${randomName}${fileExtName}`);
// };
// const imageFileFilter = (req, file, callback) => {
//   if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//     return callback(new Error('Only image files are allowed!'), false);
//   }
//   callback(null, true);
// };

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}
  @Get()
  deploy() {
    return 'Hello World';
  }
  @Get('test')
  test() {
    const email = faker.internet.email();
    const password = 123;
    const avatar = faker.image.url({ width: 500, height: 500 });
    const username = faker.person.firstName('male');
    // return this.authService.signup({
    // })
    // return { username, email, avatar, password };
  }
  // @Put()
  // @UseInterceptors(FilesInterceptor('files'))
  // getHello(@UploadedFiles() file: Express.Multer.File): string {
  //   console.log('Hello');
  //   return 'hello world';
  // }

  // @Post()
  // @UseInterceptors(
  //   FileInterceptor('image', {
  //     storage: diskStorage({
  //       destination: './files',
  //       filename: editFileName,
  //     }),
  //     fileFilter: imageFileFilter,
  //   }),
  // )
  // async uploadMulter(@UploadedFile() file) {
  //   const response = {
  //     originalname: file.originalname,
  //     filename: file.filename,
  //   };
  //   return response;
  // }

  // @Post('/uploadFile')
  // @UseInterceptors(FilesInterceptor('files'))
  // async uploadFile(@UploadedFiles() file: Express.Multer.File) {
  //   console.log('Hello --------------');
  //   console.log(file);
  // }
  @Post('/uploadFile')
  async uploadFile(@Body() files: UploadFileDto[]) {
    const fileBuffers: Buffer[] = [];
    files.forEach((file) => {
      let data = file.fileBase64.replace(/^data:image\/\w+;base64,/, '');
      fileBuffers.push(Buffer.from(data, 'base64'));
    });
    try {
      fileBuffers.forEach((fileBuffer, index) => {
        if (
          !files[index].mimetype.endsWith('jpg') &&
          !files[index].mimetype.endsWith('jpeg') &&
          !files[index].mimetype.endsWith('png')
        ) {
          throw new BadRequestException('Wrong Image Format!');
        }
        writeFile(
          join(process.cwd(), `./src/upload/${files[index].fileName}`),
          fileBuffer,
          () => {
            console.log('Done');
          },
        );
      });

      return 'File saved successfully';
    } catch (error: any) {
      files.forEach((file) => {
        unlink(join(process.cwd(), `./src/upload/${file.fileName}`), () => {
          console.log(error);
        });
      });
    }
  }
}
