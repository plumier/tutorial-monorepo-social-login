import React from "react"

function createContext<T>(value:T){
    return React.createContext<[T, (value:T) => void]>([value, val => {}])
}

export const LoginUserContext = createContext(false)