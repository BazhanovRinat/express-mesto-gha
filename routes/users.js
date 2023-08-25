const mongoose = require("mongoose");
const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');
const auth = require("../middlewares/auth");
const { getUsers, getUserById, createNewUser, patchUser, patchUserAvatar, login, getCurrentUser } = require("../controllers/users")


router.post("/signup", celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
        avatar: Joi.string().pattern(/^(https?:\/\/)(www\.)?[\w\-\.]+(:\d+)?(\/[\w\-\.~:\/?#\[\]@!$&'()*+,;=]*)?$/),
        email: Joi.string().required().email(),
        password: Joi.string().required()
    }),
}), createNewUser)
router.post("/signin", login)

router.use(auth)

router.get("/users", getUsers)
router.patch("/users/me", celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        about: Joi.string().required().min(2).max(30),
    }),
}), patchUser)
router.get("/users/me", getCurrentUser)
router.patch("/users/me/avatar", celebrate({
    body: Joi.object().keys({
        avatar: Joi.string().pattern(/^(https?:\/\/)(www\.)?[\w\-\.]+(:\d+)?(\/[\w\-\.~:\/?#\[\]@!$&'()*+,;=]*)?$/),
    }),
}), patchUserAvatar)
router.get("/users/:userId", celebrate({
    params: Joi.object().keys({
        userId: Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("objectId.invalid");
            }
            return value;
        }).message("Некорректный ID пользователя"),
    }),
}), getUserById)

module.exports = router;