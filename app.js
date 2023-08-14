const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const router = require("./routes/index")
require("dotenv").config()

const { PORT, MONGODB_URL } = process.env

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
}).then(() => {
  console.log("connected to db")
})

const app = express()

app.use(bodyParser.json())

app.use(router)

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64d4ca01c09b9b4f93c8e489'
//   };

//   next();
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})


