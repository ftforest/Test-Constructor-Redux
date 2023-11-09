import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {useParams} from 'react-router-dom'

import {PostsState, postUpdated, selectPostById} from './postsSlice'
import {useAppDispatch, useAppSelector} from "../../hooks";
import {ReactionButtons} from "./ReactionButtons";

import { useNavigate } from 'react-router-dom';


export const EditPostForm = (params:any) => {
    const { postId } = useParams()

    const post = useAppSelector(state =>
        selectPostById(state, postId))

    /*const post:any = useAppSelector(state =>
        state.posts.find(post => post.id === postId))*/

    const [title, setTitle] = useState(post.title)
    const [content, setContent] = useState(post.content)

    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const onTitleChanged = (e:any) => setTitle(e.target.value)
    const onContentChanged = (e:any) => setContent(e.target.value)

    const onSavePostClicked = () => {
        if (title && content) {
            dispatch(postUpdated({ id: postId, title, content }))
            //window.location.href =
            navigate(`/posts/${postId}`);
        }
    }

    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    placeholder="What's on your mind?"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
            </form>
            <ReactionButtons post={post}/>
            <button type="button" onClick={onSavePostClicked}>
                Save Post
            </button>
        </section>
    )
}