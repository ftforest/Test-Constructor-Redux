import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {PostsList} from "./features/posts/PostsList";
import {TestsList} from "./features/tests/TestsList";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import {AddPostForm} from "./features/posts/AddPostForm";
import {SinglePostPage} from "./features/posts/SinglePostPage";
import Navbar from "./app/Navbar";
import {EditPostForm} from "./features/posts/EditPostForm";
import {UsersList} from "./features/users/UsersList";
import {UserPage} from "./features/users/UserPage";



const Routery = () => {
    return (
        <BrowserRouter>
            <Navbar/>
            <div className="App">
                <Routes>
                    <Route path='/posts' element={
                        <React.Fragment>
                            <AddPostForm />
                            <PostsList />
                        </React.Fragment>
                    } errorElement={<ErrorPage/>}/>
                    <Route path="/posts/:postId" element={<SinglePostPage/>} errorElement={<ErrorPage/>}/>
                    <Route path="/editPost/:postId" element={<EditPostForm/>} />
                    <Route  path="/users" element={<UsersList />} />
                    <Route  path="/users/:userId" element={<UserPage/>} />

                    <Route path='tests' element={<TestsList/>} errorElement={<ErrorPage/>}/>
                    <Route path='tests/add' element={<AddPostForm/>} errorElement={<ErrorPage/>}/>
                    <Route
                        path="*"
                        element={<Navigate to="/posts" replace />}
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default Routery;