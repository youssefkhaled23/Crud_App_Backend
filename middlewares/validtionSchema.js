const { body } = require("express-validator");

const validationResult = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .isLength({ min: 3 })
      .withMessage("Title should be at least 3 characters long"),
    body("price")
      .notEmpty()
      .withMessage("price is required")
      .isNumeric()
      .withMessage("Price should be a number"),
  ];
};

module.exports = validationResult;
