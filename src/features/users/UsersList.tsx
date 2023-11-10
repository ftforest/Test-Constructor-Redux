import React from 'react'
import { Link } from 'react-router-dom'
import {selectAllUsers, UsersState} from './usersSlice'
import {useAppSelector} from "../../hooks";

export const UsersList = () => {
    const users = useAppSelector(selectAllUsers)

    const renderedUsers = users.map((user:UsersState) => (
        <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
        </li>
    ))

    return (
        <section>
            <h2>Users</h2>

            <ul>{renderedUsers}</ul>
        </section>
    )
}