import { createSlice } from '@reduxjs/toolkit'

const initialState = [
    {id: "1",title: "Тестовый тест 1",author_id: "1",created_at: "2023-03-27"},
    {id: "2",title: "Тестовый тест 2",author_id: "1",created_at: "2023-03-28"},
    {id: "3",title: "Тестовый тест 3",author_id: "1",created_at: "2023-09-23"}
]

const testsSlice = createSlice({
    name: 'tests',
    initialState,
    reducers: {}
})

export default testsSlice.reducer