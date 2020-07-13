const puppeteer = require('puppeteer');

const url = 'https://currentmillis.com/';
const bootstrap = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--allow-running-insecure-content',
      '--enable-usermedia-screen-capturing',
      '--allow-http-screen-capture',
      '--auto-select-desktop-capture-source=pickme',
      '--autoplay-policy=no-user-gesture-required',
      '--enable-experimental-web-platform-features',
      '--disable-features=AutoplayIgnoreWebAudio',
      '--disable-infobars',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--use-gl=egl',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
    ],
    ignoreDefaultArgs: ['--mute-audio'],
  });

  const page = await browser.newPage();
  page.setViewport({
    height: 1920,
    width: 1080,
  });

  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitFor(4000);

  try {
    await page.evaluate(async () => {
      document.title = 'pickme';
      const serverURL = `http://localhost:3001/api/v1`;

      console.log = async (message, data = {}) => {
        await fetch(serverURL + `/log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, data }),
        });
      };

      console.log('inside page evaluate ');

      const { MediaRecorder, Blob } = window;

      let uploadCount = 1;
      const uploadBlob = (blobData, fileName) => {
        console.log(`FileName: ${fileName}`);
        const fd = new FormData();
        fd.append('upl', blobData, `${fileName}.webm`);
        fetch(`${serverURL}/upload`, {
          method: 'post',
          body: fd,
        })
          .then((response) => {
            uploadCount++;
            console.log('Upload done');
            return response;
          })
          .catch((err) => {
            console.log(`Upload Error`, { err });
          });
      };

      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
      });

      function record_and_send() {
        console.log('record_and_send called');
        const recorder = new MediaRecorder(stream, {
          audioBitsPerSecond: 128000,
          videoBitsPerSecond: 5000000,
          mimeType: 'video/webm; codecs=vp9',
        });
        const chunks = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = (e) => {
          const superBuffer = new Blob(chunks, {
            type: 'video/webm',
          });
          uploadBlob(superBuffer, `${uploadCount}`);
        };
        setTimeout(() => recorder.stop(), 5000); // we'll have a 5s media file
        recorder.start();
      }

      setInterval(record_and_send, 5000);

      //   const mediaRecorder = new MediaRecorder(stream, {
      //     audioBitsPerSecond: 128000,
      //     videoBitsPerSecond: 5000000,
      //     // ignoreMutedMedia: true,
      //     mimeType: 'video/webm; codecs=vp9',
      //   });

      //   let chunks = [];
      //   mediaRecorder.onstop = async () => {
      //     const superBuffer = new Blob(chunks, {
      //       type: 'video/webm',
      //     });
      //     uploadBlob(
      //       superBuffer,
      //       `${baseFileName}__${recordingStartTime}__${Date.now()}__${uploadCount}`,
      //     );
      //     recordingStartTime = undefined;
      //     uploadCount++;
      //     chunks = [];
      //   };

      //   Push chunks when data is available
      //   mediaRecorder.ondataavailable = e => {
      //     console.log(`Inside data available: ${Date.now()}`);
      //     if (recordingStartTime === undefined) {
      //       recordingStartTime = Date.now();
      //     }
      //     if (e.data.size > 0) {
      //       chunks.push(e.data);
      //     }
      //   };
      setTimeout(() => {
        console.log(`Recording is stopped`);
      }, 70000);
    });

    console.log(`Initialized window navigator success`);
  } catch (e) {
    console.log(`Exception occurred with initialization ${e}`);
  }

  await page.waitFor(130000);
  console.log(`Force closing it now`);
  await page.close();
  await browser.close();
};

bootstrap();
