// hand-written action creator
import {nanoid} from "@reduxjs/toolkit";

export function postAdded(title:string, content:string, userId:string) {
    const id = nanoid()
    return {
        type: 'posts/postAdded',
        payload: { id, title, content, user: userId, reaction:'' }
    }
}