import {createSlice, createAsyncThunk, nanoid, createEntityAdapter} from '@reduxjs/toolkit'

import { client } from '../../api/client'
import {faker} from "@faker-js/faker";
import {RootState} from "../../app/store";

const notificationsAdapter = createEntityAdapter({
    sortComparer: (a:NotificationsState, b:NotificationsState) => b.date.localeCompare(a.date)
})

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
    read:boolean;
}

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: notificationsAdapter.getInitialState(),
    reducers: {
        allNotificationsRead(state:any, action) {
            Object.values(state.entities).forEach((notification:any) => {
                notification.read = true
            })
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchNotifications.fulfilled, (state:any, action) => {
            notificationsAdapter.upsertMany(state, action.payload)
            Object.values(state.entities).forEach((notification:any) => {
                // Any notifications we've read are no longer new
                notification.isNew = !notification.read
            })
        })
    }
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const { selectAll: selectAllNotifications } =
    notificationsAdapter.getSelectors((state:any) => state.notifications)

