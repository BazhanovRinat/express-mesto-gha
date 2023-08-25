const mongoose = require("mongoose");
const router = require("express").Router();
const auth = require("../middlewares/auth");
const { celebrate, Joi } = require('celebrate');
const { createNewCard, deleteCard, getCards, likeCard, dislakeCards } = require("../controllers/card")

router.use(auth)

router.post("/cards", celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        link: Joi.string().pattern(/^(https?:\/\/)(www\.)?[\w\-\.]+(:\d+)?(\/[\w\-\.~:\/?#\[\]@!$&'()*+,;=]*)?$/),

    }),
}), createNewCard)
router.get("/cards", getCards)
router.put("/cards/:cardId/likes", celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("objectId.invalid");
            }
            return value;
        }).message("Некорректный ID пользователя"),
    }),
}), likeCard)
router.delete("/cards/:cardId/likes", celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("objectId.invalid");
            }
            return value;
        }).message("Некорректный ID пользователя"),
    }),
}), dislakeCards)
router.delete("/cards/:cardId", celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("objectId.invalid");
            }
            return value;
        }).message("Некорректный ID пользователя"),
    }),
}), deleteCard)


module.exports = router;