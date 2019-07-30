// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// https://electronjs.org/docs/api/desktop-capturer#desktopcapturergetsourcesoptions-callback

// In the renderer process.
const {
  desktopCapturer,
  remote,
} = require('electron');
const durationE = document.getElementById("duration");
// console.log(remote.screen.getCursorScreenPoint())
// remote.dialog.showMessageBox({ title: "T i t l e" });
// remote.dialog.showOpenDialog({ title: "save location", properties: ["openDirectory"] },
//   (filePaths, bookmarks) => {
//     console.log(filePaths, bookmarks);
//   }
// );

const fs = require("fs");
let recorder, isRecording = false;
let blobs = [], recordingInitTime = null, timerId = null;

function toggleRecording(e) {
  if (isRecording) {
    isRecording = false;
    stopRecording();
    e.innerHTML = "START Recording";
  } else {
    isRecording = true;
    startRecording();
    e.innerHTML = "STOP Recording";
  }
}

function getSources() { desktopCapturer.getSources({ types: ['window', 'screen'] }).then(console.log); }

function stopRecording() { recorder.stop(); }

console.log(navigator.mediaDevices.getSupportedConstraints())
function startRecording() {
  desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
    // for (const source of sources) {
    // console.log(source)
    // if (source.name === 'Entire screen') {
    // if (source.name === 'Hello World!') {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        /* to capture just video */
        // audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            // chromeMediaSourceId: source.id,
            // minWidth: 1280,
            // maxWidth: 1280,
            // minHeight: 720,
            // maxHeight: 720
          }
        },
        /* to capture both audio and video */
        audio: {
          mandatory: {
            chromeMediaSource: 'desktop'
          }
        },
        // video: {
        //   mandatory: {
        //     chromeMediaSource: 'desktop'
        //   }
        // }
      });
      handleStream(stream);
    } catch (e) {
      console.warn(e);
    }
    return;
    // }
    // }
  });
}

function handleStream(stream) {
  recorder = new MediaRecorder(stream);
  blobs = [];
  recorder.ondataavailable = function (event) {
    blobs.push(event.data);
  };
  recorder.onstop = onStopRecording;
  recorder.start();
  recordingInitTime = new Date().getTime();
  timerId = setInterval(() => {
    const duration = new Date(new Date().getTime() - recordingInitTime);
    // durationE.innerHTML = duration.getMinutes
  }, 1000);
  // const video = document.querySelector('video');
  // video.srcObject = stream;
  // video.onloadedmetadata = (e) => video.play();
}

function onStopRecording() {
  console.log("onStopRecording");
  clearInterval(timerId);
  toArrayBuffer(new Blob(blobs, { type: 'video/mp4' }), function (ab) {
    var buffer = toBuffer(ab);
    var file = `./example.mp4`;
    fs.writeFile(file, buffer, function (err) {
      if (err) {
        console.error('Failed to save video ' + err);
      } else {
        console.log('Saved video: ' + file);
      }
    });
  });
}

function toArrayBuffer(blob, cb) {
  let fileReader = new FileReader();
  fileReader.onload = function () {
    // let arrayBuffer = this.result; cb(arrayBuffer);
    cb(this.result);
  };
  fileReader.readAsArrayBuffer(blob);
}

function toBuffer(ab) {
  // https://stackoverflow.com/questions/52165333/deprecationwarning-buffer-is-deprecated-due-to-security-and-usability-issues
  let buffer = Buffer.alloc(ab.byteLength);
  let arr = new Uint8Array(ab);
  for (let i = 0; i < arr.byteLength; i++) {
    buffer[i] = arr[i];
  }
  return buffer;
}

class DateExtended {
  constructor(date) {
    this.date = new Date(date);
  }

  totalMinutes = () => {
    // this.date.
  }

}