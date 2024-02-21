import { useEffect, useState } from "react"

export function App() {
  const initialTime = 25
  // const timeInSeconds = 10
  const timeInSeconds = 60 * initialTime
  const [time, setTime] = useState(timeInSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [counter, setCounter] = useState(0)

  const audio = new Audio('../alert.m4a')

  const displayedTime = `${formatNumbers(Math.trunc(time/60))}:${(formatNumbers(time%60))}`

  function toggleClock() {
    setIsRunning(!isRunning)
  }

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

  function tickTimer() {
    if(isRunning) {
      setTimeout(() => {
        setTime(prev => prev - 1)
        document.title = displayedTime
        if(time < 2) {
          setIsRunning(false)
          setCounter(prev => prev + 1)
          // audio.play()
        }
      }, 1000)
    }
  }

  useEffect(() => {
    tickTimer()
  }, [isRunning, time])

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl text-blue-500">Pomodoro</h1>

      <div className="flex flex-col items-center gap-4">
        {/* <p>{`${formatNumbers(Math.trunc(time/60))}:${(formatNumbers(time%60))}`}</p> */}
        <p className="mt-4 text-2xl font-bold">{displayedTime}</p>
        <p className="text-lg font-semibold">#{counter}</p>
        <button className="bg-green-600 text-white font-semibold px-8 py-2 rounded-lg" onClick={toggleClock}>{isRunning ? 'Stop' : 'Start'}</button>
      </div>

      <button className="mt-8 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg" onClick={reset}>reset</button>
    </div>
  )
}
