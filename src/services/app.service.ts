import { webm2Mpegts } from '../utils/video.util';
class AppService {
  public async handleFileUpload(file: any) {
    await webm2Mpegts(file.path);
    console.log({ file });
  }
}
export default AppService;
