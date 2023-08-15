const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const router = require("./routes/index")
require("dotenv").config()

//const { PORT, MONGODB_URL } = process.env

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
}).then(() => {
  console.log("connected to db")
})

const helmet = require('helmet');

const app = express()

app.use(helmet());

app.use(bodyParser.json())

app.use(router)

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64d4ca01c09b9b4f93c8e489'
//   };

//   next();
// });

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`)
})


