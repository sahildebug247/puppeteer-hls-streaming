import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
const NodeMediaServer = require('node-media-server');
import { join } from 'path';
async function bootstrap() {
  const config = {
    logType: 3,

    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60,
    },
    http: {
      port: 8000,
      mediaroot: join(__dirname, '..', 'assets', 'puppeteer-uploads'),
      allow_origin: '*',
    },
    trans: {
      ffmpeg: '/usr/bin/ffmpeg_static/ffmpeg',
      tasks: [
        {
          app: 'live',
          mode: 'push',
          edge: 'rtmp://localhost/live/puppeteer_stream',
          vc: 'copy',
          vcParam: [],
          ac: 'aac',
          acParam: ['-ab', '64k', '-ac', '1', '-ar', '44100'],
          rtmp: true,
          rtmpApp: 'live2',
          hls: true,
          hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
          dash: true,
          dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
        },
      ],
    },
  };
  const nms = new NodeMediaServer(config);
  nms.run();
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');

  app.enableCors();

  const port = process.env.PORT || 3001;
  await app.listen(port);
}

bootstrap();
