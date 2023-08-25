const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getUsers, getUserById, createNewUser, patchUser, patchUserAvatar, login, getCurrentUser } = require("../controllers/users")

router.post("/signup", createNewUser)
router.post("/signin", login)

router.use(auth)

router.get("/users", getUsers)
router.patch("/users/me", patchUser)
router.get("/users/me", getCurrentUser)
router.patch("/users/me/avatar", patchUserAvatar)
router.get("/users/:userId", getUserById)

module.exports = router;