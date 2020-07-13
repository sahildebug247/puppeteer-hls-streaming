const child_process = require('child_process');
const FFMPEG_DIR = '/usr/bin/ffmpeg';

// o {fp, t0}
async function webm2Mpegts(filePath: string) {
  let out: any = [];
  let err: any = [];
  const fps = 30;
  //   filePath = `../../` + filePath;
  const newFilePath = filePath
    .replace('webm', 'ts')
    .replace('puppeteer-uploads', 'streaming-output');

  console.log({ filePath, newFilePath });
  const args = [
    FFMPEG_DIR,
    '-v',
    'quiet', // less verbose
    '-loglevel',
    'error',
    '-i',
    filePath, // inpuf file(s)
    '-vcodec',
    'libx264', // video codec
    '-acodec',
    'libfaac', // audio codec
    // '-tune', 'zerolatency', // optimize for streaming?
    '-r',
    fps, // frame rate (fps)
    '-profile:v',
    'baseline', // ?
    '-b:v',
    '800k', // video bitrate
    '-b:a',
    '48k', // audio bitrate
    '-f',
    'mpegts', // desired format
    '-mpegts_copyts',
    '1',
    // 'setpts=PTS+' + t0 + '/TB',
    //-async 1
    '-y', // overwrite output files
    newFilePath, // output file
  ];

  //console.log(args.join(' '));

  const cmd = args.shift();

  const proc = child_process.spawn(cmd, args);

  proc.stdout.on('data', function (data) {
    out.push(data.toString());
  });

  proc.stderr.on('data', function (data) {
    err.push(data.toString());
  });

  proc.on('close', function () {
    out = out.join('').trim();
    err = err.join('').trim();
    if (out) {
      console.log('\nOUT\n' + out + '\n');
    }
    if (err) {
      console.log('\nERR\n' + err + '\n');
    }

    console.log('conversion done');
  });
}

export { webm2Mpegts };
