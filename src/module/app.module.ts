import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import AppService from '../services/app.service';
import AppController from '../controller/app.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
