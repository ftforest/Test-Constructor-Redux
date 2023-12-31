import {createAsyncThunk, createSlice, nanoid, PayloadAction, createSelector, createEntityAdapter} from '@reduxjs/toolkit'
import { sub } from 'date-fns'
import { client } from '../../api/client'
import {UsersState} from "../users/usersSlice";

export interface PostsState {
    id: string;
    date: string;
    title: string;
    content: string;
    user:any;
    reactions:{
        [unit: string]: number;
        thumbsUp: number,
        hooray: number,
        heart: number,
        rocket: number,
        eyes: number,
    };
}

/*const initialState: PostsState[] = [
    { id: '1',
        date: sub(new Date(), { minutes: 10 }).toISOString(),
        title: 'First Post!', content: 'Hello!', user: '',
        reactions: {
            thumbsUp: 0,
            hooray: 0,
            heart: 0,
            rocket: 0,
            eyes: 0,
        }
    },
    { id: '2',
        date: sub(new Date(), { minutes: 5 }).toISOString(),
        title: 'Second Post', content: 'More text', user: '',
        reactions: {
            thumbsUp: 0,
            hooray: 0,
            heart: 0,
            rocket: 0,
            eyes: 0,
        }
    }
]*/

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await client.get('/fakeApi/posts')
    return response.data
})

export interface  initPostsState {
// Multiple possible status enum values
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null
}

const postsAdapter = createEntityAdapter({
    sortComparer: (a:PostsState, b:PostsState) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
    status: 'idle',
    error: null
})

export const addNewPost:any = createAsyncThunk(
    'posts/addNewPost',
    // The payload creator receives the partial `{title, content, user}` object
    async initialPost => {
        // We send the initial data to the fake API server
        const response = await client.post('/fakeApi/posts', initialPost)
        // The response includes the complete post object, including unique ID
        return response.data
    }
)

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        /*postAdded: {
            reducer(state, action: PayloadAction<PostsState>) {
                state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        date: new Date().toISOString(),
                        title,
                        content,
                        user: userId,
                        reactions: {
                            thumbsUp: 0,
                            hooray: 0,
                            heart: 0,
                            rocket: 0,
                            eyes: 0,
                        }
                    }
                }
            }
        },*/
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost:any = state.entities[postId]
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        postUpdated(state, action) {
            const { id, title, content } = action.payload
            const existingPost = state.entities[id]
            if (existingPost) {
                existingPost.title = title
                existingPost.content = content
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action:any) => {
                state.status = 'succeeded'
                // Add any fetched posts to the array
                // Use the `upsertMany` reducer as a mutating update utility
                postsAdapter.upsertMany(state, action.payload)
            })
            .addCase(fetchPosts.rejected, (state:any, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, postsAdapter.addOne)

    }
})

export const { postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// Export the customized selectors for this adapter using `getSelectors`
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors((state:any) => state.posts)

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter((post:PostsState) => post.user === userId)
)