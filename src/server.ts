import host from "./auth/auth.router"

// import express from 'express'
const express = require('express')
const app = express()
const port = 3000

//middlewares
// {handles url-encoded data ie => form data. By pulling out data as a parameter when it comes in as a URL}
// app.use(express.urlencoded({extended: false}));

// {getting data comming in form of a json format}
app.use(express.json())
       
// routes
host(app)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app running on  http://localhost:${port}`))