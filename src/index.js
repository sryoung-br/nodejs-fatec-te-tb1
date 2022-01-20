const express = require('express')
const router = require('./routes/routes')
const fs = require("fs").promises;
const moment = require('moment')

const app = express()

app.use(express.json())

app.use("/user/:id", async (req, resp, next) => {
    const { body } = req

    if(req.method == "PUT") {
        const { name, email, password } = body
        var stack = []
        var state = []
        !+req.params.id && stack.push('id') && state.push('Invalid')
        !name && stack.push('name')
        !email && stack.push('email')
        !password && stack.push('password')
        state.push('Missing')
    }
    else if(req.method == "GET" || req.method == "DELETE") {
        var stack = []
        var state = []
        !+req.params.id && stack.push('id') && state.push('Invalid')
    }
    if(stack.length > 0) {
        let data = `${moment().format('YYYY-MM-DD hh:mm:ss')} - ${state.join('|')}: ${stack.join(', ')}\n`
        let path = "files/logs/log-error.txt"
        await fs.writeFile(
            path,
            data,
            {flag: 'a'}
        )
    }
    next()
})

app.use("/user", async (req, resp, next) => {
    const { body } = req
    if(req.method == "POST") {
        const { name, email, password } = body
        var stack = []
        !name && stack.push('name')
        !email && stack.push('email')
        !password && stack.push('password')
        
        if(stack.length > 0) {
            let data = `${moment().format('YYYY-MM-DD hh:mm:ss')} - Missing: ${stack.join(', ')}\n`
            let path = "files/logs/log-error.txt"
            await fs.writeFile(
                path,
                data,
                {flag: 'a'}
            )
        }
    }
    next()
})

app.use("*", async (req, resp, next) => {
    if(!['/' ,'/users', '/users/', '/user', '/user/', `/user/${+req.originalUrl.split('/')[2]}`, `/user/${+req.originalUrl.split('/')[2]}/`].includes(req.originalUrl)){
        resp.status(404).send('not found')
    }
    else{
        let data = `${moment().format('YYYY-MM-DD hh:mm:ss')} - ${req.method} - ${req.protocol + '://' + req.headers.host + req.originalUrl}\n`
        let path = "files/logs/log.txt"
        await fs.writeFile(
            path,
            data,
            {flag: 'a'}
        )
    }
    next()
});

app.use(router)

app.listen(3000, () => console.log('server is running...'))