const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const router = require("./routes/index")
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const errorHandler = require("./errors/errorHandler");
const rateLimit = require('express-rate-limit')
//const NotFound = require("./errors/notFound-error")

require("dotenv").config()

// //const { PORT, MONGODB_URL } = process.env

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
}).then(() => {
  console.log("connected to db")
})

const app = express()

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
})

app.use(limiter)

app.use(cookieParser());

app.use(helmet());

app.use(bodyParser.json())

app.use(router)
app.use((req, res, next) => {
  return next(new NotFound("Страница не найдена"))
});
app.use(errorHandler)

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`)
})


