const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const { getJwtToken } = require("../utils/jwt");
const UnauthorizedError = require("../errors/unauthorized-error");
const NotFound = require("../errors/notFound-error")
const BadRequest = require("../errors/badRequest-error")
const Conflict = require("../errors/conflict-error")

const SALT_ROUNDS = 10;

const getUsers = (req, res) => {
  return userModel.find({})
    .then((users) => {
      return res.status(200).send(users)
    })
}
const getUserById = (req, res, next) => {
  const { userId } = req.params

  return userModel.findById(userId)
    // .orFail(new Error("Error"))
    .then((user) => {
      if (!user) {
        return next(new NotFound("Пользователь не найден"))
      }
      return res.status(200).send({ user })
    })
    .catch((err) => {
      console.log(err.name)
      if (err.name === 'CastError') {
        return next(new BadRequest("Неправильный Id пользователя"))
      }
    })
}

const createNewUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body

  if (!email || !password) {
    return next(new BadRequest("Почта или пароль не могут быть пустыми"))
  }

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      return userModel.create({ name, about, avatar, email, password: hash })
    })
    .then(({ _id }) => {
      return res.status(201).send({ id: _id })
    })
    .catch((err) => {
      console.log(err)
      if (err.code === 11000) {
        return next(new Conflict("Такой пользователь уже существует"))
      }
      if (err.name === "ValidationError") {
        return next(new BadRequest(`${Object.values(err.errors).map((err) => err.message).join(", ")}`))
      }
    })
}

const patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body

  return userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    // .orFail(new Error("Error"))
    .then((user) => {
      if (!user) {
        return next(new NotFound("Пользователь не найден"))
      }
      return res.status(200).send({ avatar })
    })
    .catch((err) => {
      // if (err.name === "Error") {
      //   return res.status(404).send({ message: "Пользователь не найден" });
      // }
      if (err.name === "ValidationError") {
        return next(new BadRequest(`${Object.values(err.errors).map((err) => err.message).join(", ")}`))
      }
    })
}

const patchUser = (req, res, next) => {
  const { name, about } = req.body

  return userModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    // .orFail(new Error("Error"))
    .then((user) => {
      console.log(user)
      if (!user) {
        return next(new NotFound("Пользователь не найден"))
      }
      return res.status(200).send({ name, about })
    })
    .catch((err) => {
      console.log(err.name)
      // if (err.name === "Error") {
      //   return res.status(404).send({ message: "Пользователь не найден" });
      // }
      if (err.name === "ValidationError") {
        return next(new BadRequest(`${Object.values(err.errors).map((err) => err.message).join(", ")}`))
      }
    })
}

const login = (req, res, next) => {
  const { email, password } = req.body

  //вместо if надо будет использовать celebrate
  if (!email || !password) {
    return next(new BadRequest("Почта или пароль не могут быть пустыми"))
  }

  userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new NotFound("Пользователь не найден"))
        //return res.status(403).send({ message: "Пользователя не существует" })
      }
      bcrypt.compare(password, user.password, function (err, isValidPassport) {
        if (!isValidPassport) {
          return next(new UnauthorizedError("Пароль не верный"))
          //return res.status(401).send({ message: "Пароль не верный" })
        }
        const token = getJwtToken({ _id: user._id });
        return res.status(200).send({ token, password: user.password })
      });
    })
    .catch((err) => {
      console.log(err)
    })
}

const getCurrentUser = (req, res, next) => {
  //console.log(req.user._id)
  return userModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFound("Пользователь не найден"))
      }
      return res.status(200).send({ user })
    })
    .catch((err) => {
      console.log(err.name)
      if (err.name === 'CastError') {
        return next(new BadRequest("Неправильный Id пользователя"))
      }
      console.log(err)
    })
}

module.exports = { getUsers, getUserById, createNewUser, patchUser, patchUserAvatar, login, getCurrentUser }


