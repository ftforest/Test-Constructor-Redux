import React from 'react'
import {Link, useParams} from 'react-router-dom'

import { selectUserById } from '../users/usersSlice'
import {PostsState, selectAllPosts, selectPostById, selectPostsByUser} from '../posts/postsSlice'
import {useAppSelector} from "../../hooks";

export const UserPage = (props:any) => {
    const { userId } = useParams();

    const user:any = useAppSelector(state =>
        userId ? selectUserById(state, userId) : undefined)

    //const user = useAppSelector(state => selectUserById(state, userId))

    const postsForUser = useAppSelector((state:any) => selectPostsByUser(state, userId))

    const postTitles = postsForUser.map((post:PostsState,idx:number) => (
        <li key={idx}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li>
    ))

    return (
        <section>
            <h2>{user.name}</h2>

            <ul>{postTitles}</ul>
        </section>
    )
}