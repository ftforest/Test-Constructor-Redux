import {delay, http as rest, HttpResponse} from 'msw'
import { setupWorker } from 'msw/browser'
import { factory, oneOf, manyOf, primaryKey } from '@mswjs/data'
import { nanoid } from '@reduxjs/toolkit'
import { faker } from '@faker-js/faker';
//import { Server as MockSocketServer } from 'mock-socket'
import { setNouns as setRandom } from 'txtgen'
import {UsersState} from "../features/users/usersSlice";
import {PostsState} from "../features/posts/postsSlice";
export const name: string = faker.person.firstName();

const seedrandom = require('seedrandom');
let rng = seedrandom('<seed>');

const MockSocketServer  = require('mock-socket');

//import { parseISO } from 'date-fns'

const NUM_USERS = 3
const POSTS_PER_USER = 3
const RECENT_NOTIFICATIONS_DAYS = 7

// Add an extra delay to all endpoints, so loading spinners show up.
const ARTIFICIAL_DELAY_MS = 2000

let useSeededRNG = true

//let rng = seedrandom()

if (useSeededRNG) {
    let randomSeedString = localStorage.getItem('randomTimestampSeed')
    let seedDate

    if (randomSeedString) {
        seedDate = new Date(randomSeedString)
    } else {
        seedDate = new Date()
        randomSeedString = seedDate.toISOString()
        localStorage.setItem('randomTimestampSeed', randomSeedString)
    }


    //setRandom(rng)
    faker.seed(seedDate.getTime())
}

function getRandomInt(min:number, max:number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(rng() * (max - min + 1)) + min
}

const randomFromArray = (array:any) => {
    const index = getRandomInt(0, array.length - 1)
    return array[index]
}

/* MSW Data Model Setup */

export const db = factory({
    user: {
        id: primaryKey(nanoid),
        firstName: String,
        lastName: String,
        name: String,
        username: String,
        posts: manyOf('post'),
    },
    post: {
        id: primaryKey(nanoid),
        title: String,
        date: String,
        content: String,
        reactions: oneOf('reaction'),
        comments: manyOf('comment'),
        user: oneOf('user'),
    },
    comment: {
        id: primaryKey(String),
        date: String,
        text: String,
        post: oneOf('post'),
    },
    reaction: {
        id: primaryKey(nanoid),
        thumbsUp: Number,
        hooray: Number,
        heart: Number,
        rocket: Number,
        eyes: Number,
        post: oneOf('post'),
    },
})

const createUserData = () => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    return {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        username: faker.internet.userName(),
    }
}

const createPostData = (user:any) => {
    return {
        title: faker.lorem.words(),
        date: faker.date.recent({ days: RECENT_NOTIFICATIONS_DAYS }).toISOString(),
        user,
        content: faker.lorem.paragraphs(),
        reactions: db.reaction.create(),
    }
}

// Create an initial set of users and posts
for (let i = 0; i < NUM_USERS; i++) {
    const author = db.user.create(createUserData())
    for (let j = 0; j < POSTS_PER_USER; j++) {
        const newPost = createPostData(author)
        db.post.create(newPost)
    }
}

const serializePost = (post:any) => ({
    ...post,
    user: post.user.id,
})

export const handlers = [
    rest.get('/fakeApi/posts',   async (
        { request,
          params,
          cookies }) => {
        const { id } = params
        console.log('Fetching user with ID "%s"', id)
        const posts = db.post.getAll().map(serializePost)
        //return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(posts))
        await delay(ARTIFICIAL_DELAY_MS)
        //return json
        return HttpResponse.json(posts)
    }),
    rest.post('/fakeApi/posts',
        async ({ request:req,...url }) => {
        //console.log(req,'req')
            //const nextPost = await req.json()
        //console.log(nextPost,'nextPost')
        //console.log(url,'url')
        //const data:any = req.body
        const data:any = await req.json()

        if (data.content === 'error') {
            await delay(ARTIFICIAL_DELAY_MS)
            return new Response(null, {
                status: 500
            })
        }
        console.log(data,'data')
        data.date = new Date().toISOString()

        const user = db.user.findFirst({ where: { id: { equals: data.user } } })
        data.user = user
        data.reactions = db.reaction.create()

            console.log(data,'data')

        const post = db.post.create(data)
        //return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(serializePost(post)))
        await delay(ARTIFICIAL_DELAY_MS)
        //return json
        return HttpResponse.json(serializePost(post))
    }),
    /*rest.get('/fakeApi/posts/:postId', async (
        {   request:req,
            params,
            cookies }) => {
        const { postId } = params
        const post = db.post.findFirst({
            where: { id: { equals: postId } },
        })
        return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(serializePost(post)))
    }),
    rest.patch('/fakeApi/posts/:postId', (req, res, ctx) => {
        const { id, ...data } = req.body
        const updatedPost = db.post.update({
            where: { id: { equals: req.params.postId } },
            data,
        })
        return res(
            ctx.delay(ARTIFICIAL_DELAY_MS),
            ctx.json(serializePost(updatedPost))
        )
    }),

    rest.get('/fakeApi/posts/:postId/comments', (req, res, ctx) => {
        const post = db.post.findFirst({
            where: { id: { equals: req.params.postId } },
        })
        return res(
            ctx.delay(ARTIFICIAL_DELAY_MS),
            ctx.json({ comments: post.comments })
        )
    }),

    rest.post('/fakeApi/posts/:postId/reactions', (req, res, ctx) => {
        const postId = req.params.postId
        const reaction = req.body.reaction
        const post = db.post.findFirst({
            where: { id: { equals: postId } },
        })

        const updatedPost = db.post.update({
            where: { id: { equals: postId } },
            data: {
                reactions: {
                    ...post.reactions,
                    [reaction]: (post.reactions[reaction] += 1),
                },
            },
        })

        return res(
            ctx.delay(ARTIFICIAL_DELAY_MS),
            ctx.json(serializePost(updatedPost))
        )
    }),
    rest.get('/fakeApi/notifications', (req, res, ctx) => {
        const numNotifications = getRandomInt(1, 5)

        let notifications = generateRandomNotifications(
            undefined,
            numNotifications,
            db
        )

        return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(notifications))
    }),*/
    rest.get('/fakeApi/users', async (
        { request,
            params,
            cookies }) => {
        await delay(ARTIFICIAL_DELAY_MS)
        return HttpResponse.json(db.user.getAll())
    }),
]

export const worker = setupWorker(...handlers)
