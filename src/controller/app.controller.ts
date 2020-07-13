import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import AppService from '../services/app.service';

@Controller('')
class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('log')
  public async logPuppeteer(@Body() schema) {
    console.log(schema);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('upl', {
      //   dest: 'assets/puppeteer-uploads',
      storage: diskStorage({
        destination: function (req, file, cb) {
          cb(null, `assets/puppeteer-uploads`);
        },
        filename: function (req, file, cb) {
          console.log({ file });
          cb(null, file.originalname);
        },
      }),
    })
  )
  public async uploadFile(@UploadedFile() file) {
    this.appService.handleFileUpload(file);
  }
}

export default AppController;
