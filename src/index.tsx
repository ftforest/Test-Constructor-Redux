import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";

import {store} from "./app/store";
import { fetchUsers } from './features/users/usersSlice'
import {name,worker} from "./api/server";

//import { worker } from './api/server'

async function deferRender() {
    if (process.env.NODE_ENV !== 'development') {
        return
    }

    //const { worker } = await import('./mocks/browser')

    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and ready to intercept requests.
    return worker.start()
}

deferRender().then(() => {
    store.dispatch(fetchUsers())

    const root = ReactDOM.createRoot(
        document.getElementById('root') as HTMLElement
    );
    root.render(
        <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </React.StrictMode>
    );
})

console.log(name,'name')

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
