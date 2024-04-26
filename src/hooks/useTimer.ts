import { useEffect, useRef, useState } from "react"
import { formatToTwoDigits } from "../utils/formatToTwoDigits"

const WORK_TIME = 60 * 50 // time in minutes
const REST_TIME = 60 * 10 // time in minutes

export function useTimer() {
    const [isRunning, setIsRunning] = useState(false)
    const timerWorkerRef = useRef<Worker | null>(null)

    const [isInterval, setIsInterval] = useState(false)
    const [time, setTime] = useState(isInterval ? REST_TIME : WORK_TIME)

    const [pomodoroCounter, setPomodoroCounter] = useState(0)

    const audio = new Audio('./src/assets/sounds/Alarm09.mp4')

    const displayedTime = (time: number) => `${formatToTwoDigits(Math.trunc(time / 60))}:${(formatToTwoDigits(time % 60))}`

    function reset() {
        setTime(WORK_TIME)
        document.title = WORK_TIME.toString()
    }

    function completWork() {
        setIsInterval(true)
        setIsRunning(false)
        setTime(REST_TIME)
    }

    function completeRest() {
        setPomodoroCounter(prev => prev + 1)
        setIsInterval(false)
        setIsRunning(false)
        setTime(WORK_TIME)
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
                    document.title = displayedTime(time)
                    break
                case 'complete work time':
                    completWork()
                    audio.play()
                    break
                case 'complete rest time':
                    completeRest()
                    audio.play()
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
