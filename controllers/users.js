const userModel = require("../models/user")

const user = {
  _id: '64d4ca01c09b9b4f93c8e489'
}

const getUsers = (req, res) => {
  return userModel.find({})
    .then((users) => {
      return res.status(200).send(users)
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send({ message: "Произошла ошибка" })
    })
}

const getUserById = (req, res) => {
  const { userId } = req.params

  return userModel.findById(userId)
    // .orFail(new Error("Error"))
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" })
      }
      return res.status(200).send({ user })
    })
    .catch((err) => {
      console.log(err.name)
      // if (err.name === "Error") {
      //   return res.status(404).send({ message: "Пользователь не найден" });
      // }
      console.log(err)
      return res.status(500).send({ message: "Произошла ошибка" })
    })
}

const createNewUser = (req, res) => {
  return userModel.create({ ...req.body })
    .then((user) => {
      return res.status(201).send({ user })
    })
    // .then((user) => {
    //   return res.status(201).send(user._id)
    // })
    .catch((err) => {
      console.log(err)
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(", ")}`
        })
      }
      return res.status(500).send({ message: "Произошла ошибка" })
    })
}

const patchUserAvatar = (req, res) => {
  const { avatar } = req.body
  const owner = user._id;

  return userModel.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .orFail(new Error("Error"))
    .then((user) => {
      return res.status(200).send({ avatar })
    })
    .catch((err) => {
      if (err.name === "Error") {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(", ")}`
        })
      }
      console.log(err.name)
      return res.status(500).send({ message: "Произошла ошибка" })
    })
}

const patchUser = (req, res) => {
  const { name, about } = req.body
  const owner = user._id;

  return userModel.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    // .orFail(new Error("Error"))
    .then((user) => {
      console.log(user)
      if (user.id !== user.id) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      return res.status(200).send({ name, about })
    })
    .catch((err) => {
      console.log(err.name)
      // if (err.name === "Error") {
      //   return res.status(404).send({ message: "Пользователь не найден" });
      // }
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(", ")}`
        })
      }
      return res.status(500).send({ message: "Произошла ошибка" })
    })
}

module.exports = { getUsers, getUserById, createNewUser, patchUser, patchUserAvatar }


