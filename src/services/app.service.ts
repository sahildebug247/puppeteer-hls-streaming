import {
  webm2Mpegts,
  findVideoDuration,
  generateM3u8Playlist,
} from '../utils/video.util';
class AppService {
  public async handleFileUpload(file: any) {
    const webmFilePath = file.path;

    const tsFilePath = webmFilePath
      .replace('webm', 'ts')
      .replace('puppeteer-uploads', 'streaming-output');

    const isFirst = file.path.includes('/1.webm');
    await webm2Mpegts(webmFilePath, tsFilePath);

    // const playlistPath = 'assets/streaming-output/playlist.m3u8';
    // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // await sleep(1500);
    // findVideoDuration(tsFilePath, (err, duration) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   duration = duration.toFixed(2);
    //   generateM3u8Playlist(
    //     duration,
    //     file.filename.replace('webm', 'ts'),
    //     playlistPath,
    //     tsFilePath,
    //     isFirst
    //   );
    // });
    console.log({ file });
  }
}
export default AppService;
