
// TimerWorker.js
let time = 0;
let isRunning = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let timerInterval = 0

function tickTimer() {
  if (isRunning) {
    timerInterval = setInterval(() => {
      postMessage({ type: 'tick', time: --time });
      if (time <= 0) {
        clearInterval(timerInterval);
        postMessage({ type: 'stop' });
      }
    }, 1000);
  }
}

onmessage = function (e) {
  const { type, payload } = e.data;
  switch (type) {
    case 'start':
      time = payload.time;
      isRunning = true;
      tickTimer();
      break;
    case 'stop':
      clearInterval(timerInterval);
      postMessage({ type: 'stop' })
      isRunning = false;
      break;
    default:
      break;
  }
};
