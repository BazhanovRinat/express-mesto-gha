const router = require("express").Router();

const { createNewCard, deleteCard, getCards, likeCard, dislakeCards} = require("../controllers/card")

router.post("/cards", createNewCard)
router.delete("/cards/:cardId", deleteCard)
router.get("/cards", getCards)
router.put("/cards/:cardId/likes", likeCard)
router.delete("/cards/:cardId/likes", dislakeCards)

module.exports = router;