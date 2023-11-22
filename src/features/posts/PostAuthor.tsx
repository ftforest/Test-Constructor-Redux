import React from 'react';
import {useAppSelector} from "../../hooks";
import {selectUserById} from "../users/usersSlice";

const PostAuthor = ({ userId }:{userId:string}) => {
    const author:any = useAppSelector((state:any) =>
        selectUserById(state, userId))

    return <span>by {author ? author.name : 'Unknown author'}</span>
};

export default PostAuthor;