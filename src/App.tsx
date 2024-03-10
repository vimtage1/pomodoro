import { useTimer } from "./hooks/useTimer"

export function App() {
  const { time, displayedTime, startTimer, stopTimer, reset, pomodoroCounter, isRunning, isInterval, skipTime } = useTimer()

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl text-blue-500">Pomodoro</h1>
      <h2>{isInterval ? 'Rest time' : 'Work time!'}</h2>

      <div className="flex flex-col items-center gap-4">
        <p className="mt-4 text-2xl font-bold">{displayedTime(time)}</p>
        <p className="text-lg font-semibold">#{pomodoroCounter}</p>
      </div>

      <div className="mt-8 flex gap-2">
        {
          isRunning ?
            <button className="bg-red-600 text-white font-semibold px-8 py-2 rounded-lg" onClick={stopTimer}>{'>>'}</button>
            :
            <button className="bg-green-600 text-white font-semibold px-8 py-2 rounded-lg" onClick={startTimer}>Start</button>
        }

        <button className="bg-gray-600 text-white font-bold px-8 py-2 rounded-lg" onClick={skipTime}>{'>>'}</button>
      </div>
      <button className="mt-8 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg" onClick={reset}>reset</button>
    </div>
  )
}
