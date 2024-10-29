const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const allowTo = require("../middlewares/allowTo");

const courseController = require("../Controllers/Courses.controller");
const validationResult = require("../middlewares/validtionSchema");
const userRoles = require("../utils/userRoles");

router
  .route("/")
  .get(courseController.getAllCourses)
  .post(verifyToken, validationResult(), courseController.createCourse);

router
  .route("/:courseId")
  .get(courseController.getSingleCourse)
  .patch(courseController.updateCourse)
  .delete(
    verifyToken,
    allowTo(userRoles.ADMIN, userRoles.MANGER),
    courseController.deleteCourse
  );

module.exports = router;
