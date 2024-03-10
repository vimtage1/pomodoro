import { useTimer } from "./hooks/useTimer"

export function App() {
  const { time, displayedTime, startTimer, stopTimer, reset, pomodoroCounter, isRunning } = useTimer()

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl text-blue-500">Pomodoro</h1>

      <div className="flex flex-col items-center gap-4">
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
