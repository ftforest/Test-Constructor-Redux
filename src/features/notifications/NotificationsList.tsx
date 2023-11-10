import React from 'react'
import { useSelector } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'

import { selectAllUsers } from '../users/usersSlice'

import { selectAllNotifications } from './notificationsSlice'
import {useAppSelector} from "../../hooks";

export const NotificationsList = () => {
    const notifications = useAppSelector(selectAllNotifications)
    const users = useAppSelector(selectAllUsers)

    const renderedNotifications = notifications.map((notification:any,idx:number) => {
        const date = parseISO(notification.date)
        const timeAgo = formatDistanceToNow(date)
        const user = users.find((user:any) => user.id === notification.user) || {
            name: 'Unknown User'
        }

        return (
            <div key={idx} className="notification">
                <div>
                    <b>{user.name}</b> {notification.message}
                </div>
                <div title={notification.date}>
                    <i>{timeAgo} ago</i>
                </div>
            </div>
        )
    })

    return (
        <section className="notificationsList">
            <h2>Notifications</h2>
            {renderedNotifications}
        </section>
    )
}