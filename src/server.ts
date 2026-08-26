import approvals from "./approvals/approvals.route"
import host from "./auth/auth.router"
import bookings from "./bookings/booking.route"
import guest from "./guests/guest.route"
import { logger } from "./middleware/logger"
import { rateLimiterMiddleware } from "./middleware/rateLimiter"
import payments from "./payments/payments.route"
import reviews from "./reviews/reviews.route"
import rooms from "./rooms/room.route"
import express from 'express'
import type { Express } from 'express'
import cors from 'cors'

const initializeApp = (): Express => {
  // const express = require('express')
  const app = express()

  // {getting data comming in form of a json format}
  app.use(express.json())

  //middlewares
  // {handles url-encoded data ie => form data. By pulling out data as a parameter when it comes in as a URL}
  // app.use(express.urlencoded({extended: false}));
  app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE',]
  })) 

  app.use(logger)
  app.use(rateLimiterMiddleware)
        
  // routes
  host(app)
  rooms(app)
  guest(app)
  bookings(app)
  payments(app)
  reviews(app)
  approvals(app)

  app.get('/', (req, res) => res.send('Hello World!'))

  return app
  
}

const app = initializeApp()
export default app
