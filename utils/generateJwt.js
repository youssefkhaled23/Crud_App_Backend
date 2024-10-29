const jwt = require("jsonwebtoken");

const generateJWT = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
  }
};

module.exports = generateJWT;
