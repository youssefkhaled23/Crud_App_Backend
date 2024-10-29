const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const StatusText = require("../utils/StatusText");
const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) {
    const error = new appError("Unauthorized", 401, StatusText.FAIL);
    return next(error);
  }
  try {
    const token = authHeader.split(" ")[1];
    const currentUser = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    // console.log(currentUser);

    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = new appError("Unauthorized", 401, StatusText.FAIL);
    return next(error);
  }
};

module.exports = verifyToken;
