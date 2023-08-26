const { default: mongoose } = require("mongoose");
const cardModel = require("../models/card")
const UnauthorizedError = require("../errors/unauthorized-error");//401
const NotFound = require("../errors/notFound-error") //404
const BadRequest = require("../errors/badRequest-error") //400
const Conflict = require("../errors/conflict-error") //409
const Forbidden = require("../errors/forbidden-error")

const createNewCard = (req, res, next) => {
    const userId = req.user._id
    console.log(userId)
    return cardModel.create({ ...req.body, owner: userId})
        .then((card) => {
            return res.status(201).send({ _id: card._id })
        })
        .catch((err) => {
            console.log(err)
            if (err.name === "ValidationError") {
                return next(new BadRequest(`${Object.values(err.errors).map((err) => err.message).join(", ")}`))
            }
        })
}

const deleteCard = (req, res, next) => {
    const { cardId } = req.params

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
        return next(new BadRequest("Некорректный id карточки"))
    }

    return cardModel.findById(cardId)
        .then((card) => {
            if (!card) {
                return next(new NotFound("Карточка не найдена"))
            }
            if (req.user._id !== card.owner._id.toString()) {
                return next(new Forbidden("Нельзя удалить чужую карточку"))
            }
            card.deleteOne()
            return res.status(200).send({ message: "Карточка удалена" })
        })
        .catch((err) => {
            console.log(err)
        })
}

const getCards = (req, res, next) => {
    return cardModel.find({})
        .then((cards) => {
            return res.status(200).send({ cards })
        })
        .catch((err) => {
            console.log(err)
        })
}

const likeCard = (req, res, next) => {
    const { cardId } = req.params
    console.log(req.user._id)

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
        return next(new BadRequest("Некорректный id карточки"))
    }
    return cardModel.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true },)
        .then((card) => {
            if (!card) {
                return next(new NotFound("Карточка не найдена"))
            }
            return res.status(200).send({ message: "Лайк поставлен" })
        })
        .catch((err) => {
            console.log(err)
        })
}

const dislakeCards = (req, res, next) => {
    const { cardId } = req.params

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
        return next(new BadRequest("Некорректный id карточки"))
    }

    return cardModel.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true },)
        .then((card) => {
            if (!card) {
                return next(new NotFound("Карточка не найдена"))
            }
            if (!cardId) {
                return next(new BadRequest("Неправильный Id карточки"))
            }
            return res.status(200).send({ message: "Лайк убран" })
        })
        .catch((err) => {
            console.log(err)
        })
}

module.exports = { createNewCard, deleteCard, getCards, likeCard, dislakeCards }
