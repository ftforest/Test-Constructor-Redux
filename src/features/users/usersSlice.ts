import {createAsyncThunk, createSlice, nanoid} from '@reduxjs/toolkit'
import { client } from '../../api/client'
import {manyOf, primaryKey} from "@mswjs/data";

export interface UsersState {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    username: string;
    posts: string[];
}

const initialState:UsersState[] = []

/*const initialState:UsersState[] = [
    { id: '0', name: 'Tianna Jenkins' },
    { id: '1', name: 'Kevin Grant' },
    { id: '2', name: 'Madison Price' }
]*/

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await client.get('/fakeApi/users')
    return response.data
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            return action.payload
        })
    }
})

export default usersSlice.reducer