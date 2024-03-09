import { useEffect, useRef, useState } from "react"

export function App() {
  const timeInSeconds = 30
  const [time, setTime] = useState(timeInSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [pomodoroCounter, setPomodoroCounter] = useState(0)

  const timerWorkerRef = useRef<Worker | null>(null)

  // const audio = new Audio('../alert.m4a')

  const displayedTime = (time: number) => `${formatNumbers(Math.trunc(time/60))}:${(formatNumbers(time%60))}`

  function reset() {
    setTime(timeInSeconds)
  }

  function formatNumbers(n: number) {
    let formatedNum = n.toString()
    if(formatedNum.length < 2) {
      formatedNum = '0' + formatedNum
      return formatedNum
    }

    return n
  }

  const startTimer = () => {
    timerWorkerRef.current?.postMessage({ type: 'start', payload: { time } })
    setIsRunning(true)
  }

  const stopTimer = () => {
    timerWorkerRef.current?.postMessage({ type: 'stop' })
    setIsRunning(false)
  }

  useEffect(() => {
    timerWorkerRef.current = new Worker('./TimerWorker.ts')

    timerWorkerRef.current.onmessage = function (e: MessageEvent) {
      const { type, time } = e.data

      switch(type) {
        case 'tick':
          setTime(time)
          document.title = time.toString()
          break
        default:
          break
      }
    }
    
    return () => {
      timerWorkerRef.current?.terminate()
    }
  }, [])

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl text-blue-500">Pomodoro</h1>

      <div className="flex flex-col items-center gap-4">
        {/* <p>{`${formatNumbers(Math.trunc(time/60))}:${(formatNumbers(time%60))}`}</p> */}
        <p className="mt-4 text-2xl font-bold">{displayedTime(time)}</p>
        <p className="text-lg font-semibold">#{pomodoroCounter}</p>
        {
          isRunning ?
            <button className="bg-red-600 text-white font-semibold px-8 py-2 rounded-lg" onClick={stopTimer}>Stop</button>
            :
            <button className="bg-green-600 text-white font-semibold px-8 py-2 rounded-lg" onClick={startTimer}>Start</button>
        }
      </div>

      <button className="mt-8 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg" onClick={reset}>reset</button>
    </div>
  )
}
