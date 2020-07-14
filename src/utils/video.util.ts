const child_process = require('child_process');
const FFMPEG_DIR = '/usr/bin/';
const fs = require('fs');

async function findVideoDuration(fp, cb) {
  let out: any = [];

  const args = [
    FFMPEG_DIR + 'ffprobe',
    '-v',
    'quiet', // less verbose
    '-print_format',
    'json', // output json
    '-show_format', // return format info
    // '-show_streams',
    fp,
  ];

  const cmd = args.shift();

  const proc = child_process.spawn(cmd, args);

  proc.stdout.on('data', function (data) {
    out.push(data.toString());
  });

  proc.on('close', function () {
    //console.log('close');
    out = out.join('');

    out = JSON.parse(out);
    console.log({ out });
    const duration = parseFloat(out.format.duration);
    cb(null, duration);
  });
}
async function webm2Mpegts(filePath: string, tsFilePath: string) {
  let out: any = [];
  let err: any = [];
  const fps = 30;
  //   filePath = `../../` + filePath;

  console.log({ filePath, tsFilePath });
  const args = [
    FFMPEG_DIR + 'ffmpeg',
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
    tsFilePath, // output file
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
  });
}

async function generateM3u8Playlist(
  duration,
  fileName,
  playlistPath,
  tsFilePath,
  isFirst
) {
  let meta;
  if (isFirst) {
    meta = [
      '#EXTM3U',
      '#EXT-X-VERSION:3',
      '#EXT-X-MEDIA-SEQUENCE:0',
      '#EXT-X-ALLOW-CACHE:YES',
      '#EXT-X-TARGETDURATION:' + duration,
    ];
    meta.push('#EXTINF:' + duration + ',');
    meta.push(fileName);
    meta.push('');
    meta = meta.join('\n');
    fs.writeFile(playlistPath, meta, () => {
      console.log('playlist file created');
    });
  } else {
    meta = [];
    meta.push('#EXTINF:' + duration + ',');
    meta.push(fileName);
    meta.push('');
    meta = meta.join('\n');
    fs.appendFile(playlistPath, meta, () => {
      console.log('playlist file appended');
    });
  }

  // if (!isLive) {
  //   meta.push('#EXT-X-ENDLIST');
  // }
}

export { webm2Mpegts, findVideoDuration, generateM3u8Playlist };
