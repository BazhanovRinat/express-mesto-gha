const { isAuthorized } = require("../utils/jwt")
const UnauthorizedError = require("../errors/unauthorized-error")
const jwt = require('jsonwebtoken');

const { JWT_SECRET = "SECRET_KEY" } = process.env
  
  const extractBearerToken = (header) => {
    return header.replace('Bearer ', '');
  };
  
  const auth = (req, res, next) => {
    const token = req.headers.authorization
 
    if (!isAuthorized(token)) {
        return next(new UnauthorizedError("Необходима авторизация"))
        // return res.status(401).send({ message: "Нет авторизации" })
    }
  
    const tokenNoBear = extractBearerToken(token);
   
    let payload;
  
    try {
      payload = jwt.verify(tokenNoBear, JWT_SECRET);
    } catch (err) {
      return next(new UnauthorizedError("Необходима авторизация!!"))
      // return handleAuthError(res);
    }
    
    req.user = payload; // записываем пейлоуд в объект запроса
    next(); // пропускаем запрос дальше
  };

module.exports = auth