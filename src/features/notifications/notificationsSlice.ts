import {createSlice, createAsyncThunk, nanoid} from '@reduxjs/toolkit'

import { client } from '../../api/client'
import {faker} from "@faker-js/faker";
import {RootState} from "../../app/store";

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { getState }) => {
        const allNotifications = selectAllNotifications(getState())
        const [latestNotification] = allNotifications
        const latestTimestamp = latestNotification ? latestNotification.date : ''
        const response = await client.get(
            `/fakeApi/notifications?since=${latestTimestamp}`
        )
        return response.data
    }
)
export interface NotificationsState {
    id:string;
    date:string;
    message:string;
    user:string;
}

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: [],
    reducers: {
        allNotificationsRead(state, action) {
            state.forEach((notification:any) => {
                notification.read = true
            })
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchNotifications.fulfilled, (state:any[], action) => {
            state.push(...action.payload)
            // Sort with newest first
            state.sort((a:any, b:any) => b.date.localeCompare(a.date))
        })
    }
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const selectAllNotifications = (state:any) => state.notifications

