const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const router = require("./routes/index")
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const NotFound = require("./errors/notFound-error")

require("dotenv").config()

// //const { PORT, MONGODB_URL } = process.env

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
}).then(() => {
  console.log("connected to db")
})

const app = express()

app.use(cookieParser());

app.use(helmet());

app.use(bodyParser.json())

app.use(router)

// app.use((req, res, next) => {
//    next(new NotFound("Страница не найдена"))
// });

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`)
})


