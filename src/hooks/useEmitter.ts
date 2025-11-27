import {useEffect, useState} from "react"

import EventEmitter from "@/utils/EventEmitter"

export default function useEmitter<Events extends Record<string, any>, K extends keyof Events>(
    emitter: EventEmitter<Events>,
    event: K
) {
    const [, setTick] = useState(0)

    useEffect(() => {
        const update = () => setTick(t => t + 1)

        return emitter.on(event, update)
    }, [emitter, event])

    return null
}
