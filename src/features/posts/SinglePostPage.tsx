import React from 'react'
import {useAppSelector} from "../../hooks";
import {Link, useParams} from "react-router-dom";
import PostAuthor from "./PostAuthor";
import {ReactionButtons} from "./ReactionButtons";
import {selectPostById} from "./postsSlice";

export function SinglePostPage(props:any) {
    const { postId } = useParams();

    const post = useAppSelector(state =>
        selectPostById(state, postId))
    /*const post = useAppSelector(state =>
        state.posts.find(post => post.id === postId))*/

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    return (
        <section>
            <article className="post">
                <h2>{post.title}</h2>
                <p className="post-content">{post.content}</p>
                <ReactionButtons post={post}/>
                <Link to={`/editPost/${post.id}`} className="button">
                    Edit Post
                </Link>
                <PostAuthor userId={post.user}/>
            </article>
        </section>
    )
}