const { default: mongoose } = require("mongoose");
const cardModel = require("../models/card")

const user = {
    _id: '64d4ca01c09b9b4f93c8e489'
}

const createNewCard = (req, res) => {
    const owner = user._id;
    return cardModel.create({ ...req.body, owner })
        .then((card) => {
            return res.status(201).send({ message: "Карточка создана", _id: card._id })
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

const deleteCard = (req, res) => {
    const { cardId } = req.params

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
        return res.status(400).send({ message: "Некорректный id карточки" })
    }

    return cardModel.findByIdAndRemove(cardId)
        .then((card) => {
            if (!card) {
                return res.status(404).send({ message: "Карточка не найдена" })
            }
            return res.status(200).send({ message: "Карточка удалена" })
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                return res.status(404).send({ message: "Неправильный Id карточки" })
            }
            console.log(err)
            return res.status(404).send({ message: "server error" })
        })
}

const getCards = (req, res) => {
    return cardModel.find({})
        .then((cards) => {
            return res.status(200).send({ cards })
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send({ message: "server error" })
        })
}

const likeCard = (req, res) => {
    const { cardId } = req.params
    const owner = user._id;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
        return res.status(400).send({ message: "Некорректный id карточки" })
    }
    return cardModel.findByIdAndUpdate(cardId, { $addToSet: { likes: owner } }, { new: true },)
        .then((card) => {
            if (!card) {
                return res.status(404).send({ message: "Карточка не найдена" })
            }
            return res.status(201).send({ message: "Лайк поставлен" })
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                return res.status(404).send({ message: "Неправильный Id карточки" })
            }
            console.log(err)
            return res.status(404).send({ message: "server error" })
        })
}

const dislakeCards = (req, res) => {
    const { cardId } = req.params
    const owner = user._id;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
        return res.status(400).send({ message: "Некорректный id карточки" })
    }

    return cardModel.findByIdAndUpdate(cardId, { $pull: { likes: owner } }, { new: true },)
        .then((card) => {
            if (!card) {
                return res.status(404).send({ message: "Карточка не найдена" })
            }
            if (!cardId) {
                return res.status(400).send({ message: "Неправильный Id карточки" })
            }
            return res.status(200).send({ message: "Лайк убран" })
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                return res.status(404).send({ message: "Неправильный Id карточки" })
            }
            console.log(err)
            return res.status(404).send({ message: "server error" })
        })
}

module.exports = { createNewCard, deleteCard, getCards, likeCard, dislakeCards }
