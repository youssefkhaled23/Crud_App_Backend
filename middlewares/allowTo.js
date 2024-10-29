const appError = require("../utils/appError");
const StatusText = require("../utils/StatusText");

module.exports = (...roles) => {
  return (res, req, next) => {
    if (!roles.includes(res.currentUser.role)) {
      return next(
        new appError(
          "You are not authorized to perform this action",
          403,
          StatusText.FAIL
        )
      );
    }
    next();
  };
};
