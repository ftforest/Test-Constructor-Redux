import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
import { Spinner } from '../../components/Spinner'
import {useAppDispatch, useAppSelector} from "../../hooks";
import {Link} from "react-router-dom";
import {ReactionButtons} from "./ReactionButtons";
import {
    selectAllPosts,
    fetchPosts,
    selectPostIds,
    selectPostById, PostsState
} from './postsSlice'
import {TimeAgo} from "./TimeAgo";
import PostAuthor from "./PostAuthor";

let PostExcerpt = ({ postId }:{postId:string}):any => {
    const post:any = useAppSelector(state =>
        postId ? selectPostById(state, postId) : undefined)
    return (
        <article className="post-excerpt">
            <h3>{post.title}</h3>
            <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date} />
            </div>
            <p className="post-content">{post.content.substring(0, 100)}</p>

            <ReactionButtons post={post} />
            <Link to={`/posts/${post.id}`} className="button muted-button">
                View Post
            </Link>
        </article>
    )
}
PostExcerpt = React.memo(PostExcerpt)

export const PostsList = () => {
    const dispatch = useAppDispatch()
    const orderedPostIds = useSelector(selectPostIds)
    //const posts = useSelector(selectAllPosts)
    const postStatus = useAppSelector(state => state.posts.status)
    const error = useAppSelector(state => state.posts.error)

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [postStatus, dispatch])

    //const posts = useAppSelector(state => state.posts)
    let content

    if (postStatus === 'loading') {
        content = <Spinner text="Loading..." />
    } else if (postStatus === 'succeeded') {
        /*const orderedPosts = posts
            .slice()
            .sort((a: PostsState, b: PostsState) => b.date.localeCompare(a.date))*/
        content = orderedPostIds.map((postId:any,idx:number) =>
            <PostExcerpt key={idx} postId={postId} />
        )
    } else if (postStatus === 'failed') {
        content = <div>{error}</div>
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {content}
        </section>
    )
}