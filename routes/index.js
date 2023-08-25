const router = require("express").Router();

const usersRouter = require("./users")
const cardRouter = require("./card")
//const auth = require("../middlewares/auth");
const errorHandler = require("../errors/errorHandler");

//router.use(auth)
router.use(usersRouter)
router.use(cardRouter)

router.use(errorHandler)

module.exports = router