import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {decrement, increment} from './counterSlice'
import { useAppSelector, useAppDispatch } from '../../hooks'
import styles from './Counter.module.css'

export function Counter() {

    // The `state` arg is correctly typed as `RootState` already
    const count = useAppSelector(state => state.counter.value)
    const dispatch = useAppDispatch()

    return (
        <div>
            <div>
                <button
                    aria-label="Increment value"
                    onClick={() => dispatch(increment())}
                >
                    Increment
                </button>
                <span>{count}</span>
                <button
                    aria-label="Decrement value"
                    onClick={() => dispatch(decrement())}
                >
                    Decrement
                </button>
            </div>
        </div>
    )
}