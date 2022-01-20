const express = require('express')
const DatabaseConnection = require('./../config/db')

const moment = require('moment')

const router = express.Router()

router.get('/', async (req, resp) => {
    resp.send('server is running...')
})

router.get('/users', async (req, resp) => {
    try {
        const databaseConnection = new DatabaseConnection()

        const db = await databaseConnection.connect()
        const {rows} = await db.query('select * from users')
        resp.status(200).send(rows)
    } catch(e){
        resp.status(400).send()
    }
})

router.get('/user/:id', async (req, resp) => {
    try {
        const databaseConnection = new DatabaseConnection()

        const db = await databaseConnection.connect()
        const {rows} = await db.query('select * from users where id = $1', [req.params.id])
        resp.status(200).send(rows)
    } catch(e){
        resp.status(400).send()
    }
})

router.post('/user', async (req, resp) => {
    try {
        const { body } = req
        const { name, email, password } = body
        const databaseConnection = new DatabaseConnection()
        const db = await databaseConnection.connect()
        const { rows } = await db.query(
            "insert into users (name, email, password, created_at, updated_at) values($1, $2, $3, $4, $5) RETURNING *",
            [name, email, password, moment().format('YYYY-MM-DD hh:mm:ss'), moment().format('YYYY-MM-DD hh:mm:ss')]
        )
        resp.status(201).send(rows)
    } catch(e){
        resp.status(400).send()
    }
})

router.get('/user/:id', async (req, resp) => {
    try {
        const databaseConnection = new DatabaseConnection()
        const db = await databaseConnection.connect()
        const { rows } = await db.query(
            "select * from users where id = $1",
            [req.params.id]
        )
        resp.status(200).send(rows)
    } catch(e){
        resp.status(400).send()
    }
})


router.put('/user/:id', async (req, resp) => {
    try {
        const { body } = req
        const { name, email, password } = body
        const databaseConnection = new DatabaseConnection()
        const db = await databaseConnection.connect()
        const { rows } = await db.query(
            "update users set name = $1, email = $2, password = $3, created_at = $4, updated_at = $5 where id = $6 RETURNING *",
            [name, email, password, moment().format('YYYY-MM-DD hh:mm:ss'), moment().format('YYYY-MM-DD hh:mm:ss'), req.params.id]
        )
        resp.status(200).send(rows)
    } catch(e){
        resp.status(400).send()
    }
})

router.delete('/user/:id', async (req, resp) => {
    try {
        const databaseConnection = new DatabaseConnection()
        const db = await databaseConnection.connect()
        const { rows } = await db.query(
            "delete from users where id = $1 RETURNING *",
            [req.params.id]
        )
        resp.status(200).send(rows)
    } catch(e){
        resp.status(400).send()
    }
})

module.exports = router