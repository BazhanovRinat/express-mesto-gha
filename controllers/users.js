const userModel = require("../models/user")

const user = {
  _id: '64d4ca01c09b9b4f93c8e489'
}

const getUsers = (req, res) => {
  return userModel.find({})
    .then((users) => {
      return res.status(201).send(users)
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send("server error")
    })
}

const getUserById = (req, res) => {
  const { userId } = req.params

  return userModel.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" })
      }
      return res.status(200).send(user)
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send("server error")
    })
}

const createNewUser = (req, res) => {
  return userModel.create({ ...req.body })
    .then((user) => {
      return res.status(201).send({message: "Пользователь создан"})
    })
    .catch((err) => {
      console.log(err)
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(", ")}`
        })
      }
      return res.status(500).send("server error")
    })
}

const patchUser = (req, res) => {
  const { name, about } = req.body
  const owner = user._id;

  return userModel.findByIdAndUpdate(owner, { name, about })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Данные обновлены" })
      }
      return res.status(200).send(user)
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send("server error")
    })
}

const patchUserAvatar = (req, res) => {
  const { avatar } = req.body
  const owner = user._id;

  return userModel.findByIdAndUpdate(owner, { avatar })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Аватар загружен" })
      }
      return res.status(200).send(user)
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send("server error")
    })
}

module.exports = { getUsers, getUserById, createNewUser, patchUser, patchUserAvatar }