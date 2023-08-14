const router = require("express").Router();

const { getUsers, getUserById, createNewUser, patchUser, patchUserAvatar } = require("../controllers/users")

router.get("/users", getUsers)
router.get("/users/:userId", getUserById)
router.post("/users", createNewUser)
router.patch("/users/me", patchUser)
router.patch("/users/me/avatar", patchUserAvatar)


//   router.delete("/cards/:cardId", (req, res) => {
//     res.send("удаление пользователя")
//   })

module.exports = router;