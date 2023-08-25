const router = require("express").Router();
const auth = require("../middlewares/auth");
const { createNewCard, deleteCard, getCards, likeCard, dislakeCards} = require("../controllers/card")

router.use(auth)

router.post("/cards", createNewCard)
router.get("/cards", getCards)
router.put("/cards/:cardId/likes", likeCard)
router.delete("/cards/:cardId/likes", dislakeCards)
router.delete("/cards/:cardId", deleteCard)


module.exports = router;