const jwt = require("jsonwebtoken");
const jwtRandom = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    //Recovery token
    const token = req.headers.authorization.split(" ")[1];
    //Decode token
    const decodedToken = jwt.verify(token, jwtRandom);
    //Extraction userId
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
