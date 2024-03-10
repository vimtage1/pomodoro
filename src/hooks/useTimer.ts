import { useEffect, useRef, useState } from "react"
import { formatToTwoDigits } from "../utils/formatToTwoDigits"

export function useTimer() {
    const timeInSeconds = 3
    const restTimeInSeconds = 2
    const [isRunning, setIsRunning] = useState(false)
    const timerWorkerRef = useRef<Worker | null>(null)

    const [isInterval, setIsInterval] = useState(false)
    const [time, setTime] = useState(isInterval ? restTimeInSeconds : timeInSeconds)

    const [pomodoroCounter, setPomodoroCounter] = useState(0)

    // const audio = new Audio('../alert.m4a')

    const displayedTime = (time: number) => `${formatToTwoDigits(Math.trunc(time / 60))}:${(formatToTwoDigits(time % 60))}`

    function reset() {
        setTime(timeInSeconds)
        document.title = timeInSeconds.toString()
    }

    const startTimer = () => {
        timerWorkerRef.current?.postMessage({ type: 'start', payload: {
            time: isInterval ? restTimeInSeconds : time,
            isInterval
        }})
        setIsRunning(true)
    }

    const stopTimer = () => {
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
                case 'complete':
                    setIsInterval(true)
                    setIsRunning(false)
                    setTime(restTimeInSeconds)
                    break
                case 'finish':
                    setPomodoroCounter(prev => prev + 1)
                    setIsInterval(false)
                    setIsRunning(false)
                    setTime(timeInSeconds)
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
    }

}