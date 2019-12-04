import React from "react"

export function useStorage<T>(storageKey: string, init: T): [T, (value: T) => void] {
    const value = localStorage.getItem(storageKey)
    const initial: T = value ? JSON.parse(value) : init
    const [state, setState] = React.useState<T>(initial)
    const dispatch = (value: T) => {
        setState(value)
        if (typeof value === "undefined" || value === null)
            localStorage.removeItem(storageKey)
        else
            localStorage.setItem(storageKey, JSON.stringify(value))
    }
    return [state, dispatch]
}