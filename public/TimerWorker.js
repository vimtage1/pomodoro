
let time = 0;
let isRunning = false;
let timerInterval = 0


function tickTimer(isInterval) {
  if (isRunning) {
    timerInterval = setInterval(() => {
      postMessage({ type: 'tick', time: --time });
      if (time <= 0) {
        clearInterval(timerInterval);
        if(isInterval) 
          postMessage({ type: 'finish' })
        else
          postMessage({ type: 'complete' });
      }
    }, 1000);
  }
}

onmessage = function (e) {
  const { type, payload } = e.data 
  switch (type) {
    case 'start':
      time = payload.time;
      isRunning = true;
      tickTimer(payload.isInterval);
      break;
    case 'stop':
      clearInterval(timerInterval);
      isRunning = false;
      break;
    default:
      break;
  }
};
