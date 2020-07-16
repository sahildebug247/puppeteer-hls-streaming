import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import AppService from '../services/app.service';
import AppController from '../controller/app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'assets', 'streaming-output'),
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule { }
