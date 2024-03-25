import { useEffect, useRef, useState } from "react"
import { formatToTwoDigits } from "../utils/formatToTwoDigits"

export function useTimer() {
    const timeInSeconds = 10
    const restTimeInSeconds = 5
    const [isRunning, setIsRunning] = useState(false)
    const timerWorkerRef = useRef<Worker | null>(null)

    const [isInterval, setIsInterval] = useState(false)
    const [time, setTime] = useState(isInterval ? restTimeInSeconds : timeInSeconds)

    const [pomodoroCounter, setPomodoroCounter] = useState(0)

    const audio = new Audio('./src/assets/sounds/Alarm09.mp4')

    const displayedTime = (time: number) => `${formatToTwoDigits(Math.trunc(time / 60))}:${(formatToTwoDigits(time % 60))}`

    function reset() {
        setTime(timeInSeconds)
        document.title = timeInSeconds.toString()
    }

    function completWork() {
        setIsInterval(true)
        setIsRunning(false)
        setTime(restTimeInSeconds)
        audio.play()
    }

    function completeRest() {
        setPomodoroCounter(prev => prev + 1)
        setIsInterval(false)
        setIsRunning(false)
        setTime(timeInSeconds)
        audio.play()
    }

    function skipTime() {
        stopTimer()
        if(isInterval) completeRest()
        else completWork()
    }

    function startTimer() {
        timerWorkerRef.current?.postMessage({ type: 'start', payload: {
            time,
            isInterval
        }})
        setIsRunning(true)
    }

    function stopTimer() {
        timerWorkerRef.current?.postMessage({ type: 'stop' })
        setIsRunning(false)
    }

    useEffect(() => {
        timerWorkerRef.current = new Worker('./TimerWorker.js')

        timerWorkerRef.current.onmessage = function (e: MessageEvent) {
            const { type, time } = e.data

            switch (type) {
                case 'tick':
                    setTime(time)
                    document.title = time.toString()
                    break
                case 'complete work time':
                    completWork()
                    // setIsInterval(true)
                    // setIsRunning(false)
                    // setTime(restTimeInSeconds)
                    break
                case 'complete rest time':
                    completeRest()
                    // setPomodoroCounter(prev => prev + 1)
                    // setIsInterval(false)
                    // setIsRunning(false)
                    // setTime(timeInSeconds)
                    break
                default:
                    break
            }
        }

        return () => {
            timerWorkerRef.current?.terminate()
        }
    }, [])

    return {
        time,
        reset,
        startTimer,
        stopTimer,
        displayedTime,
        pomodoroCounter,
        isRunning,
        isInterval,
        skipTime
    }

}