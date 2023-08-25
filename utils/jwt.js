const jwt = require('jsonwebtoken');
const userModel = require("../models/user")

const { JWT_SECRET = "SECRET_KEY" } = process.env

const getJwtToken = (payLoad) => {
    return jwt.sign(payLoad, JWT_SECRET, { expiresIn: "7d" });
}

const isAuthorized = (token) => {
    return jwt.verify(token, JWT_SECRET, function (err, decoded) {
        if (err) return false
        return userModel.findById(decoded._id)
            .then((user) => {
                return Boolean(user)
            })
            .catch((err) => {
                return false
            })
    });
}

module.exports = {
    getJwtToken,
    isAuthorized
}