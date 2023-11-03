import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
import {useAppSelector} from "../../hooks";
import {Link} from "react-router-dom";
import {ReactionButtons} from "./ReactionButtons";
import {PostsState, selectAllPosts} from "./postsSlice";

export const PostsList = () => {
    const posts = useAppSelector(selectAllPosts)
    //const posts = useSelector(selectAllPosts)

    //const posts = useAppSelector(state => state.posts)
    const orderedPosts = posts.slice().sort((a:PostsState, b:PostsState) => b.date.localeCompare(a.date))
    const renderedPosts = orderedPosts.map((post:PostsState) => (
        <article className="post-excerpt" key={post.id}>
            <h3>{post.title}</h3>
            <p className="post-content">{post.content.substring(0, 100)}</p>
            <ReactionButtons post={post}/>
                <Link to={`/posts/${post.id}`} className="button muted-button">
                View Post
            </Link>
        </article>
    ))

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {renderedPosts}
        </section>
    )
}