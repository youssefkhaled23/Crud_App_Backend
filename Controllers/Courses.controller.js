// Required imports
const { validationResult } = require("express-validator");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");
const StatusText = require("../utils/StatusText");
const Courses = require("../Model/course.model");
// Controllers
const getAllCourses = asyncWrapper(async (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  const courses = await Courses.find({}, { __v: false })
    .limit(parseInt(limit, 10))
    .skip((page - 1) * parseInt(limit, 10));
  res.status(200).json({ success: StatusText.SUCCESS, data: courses });
});

const getSingleCourse = asyncWrapper(async (req, res, next) => {
  const course = await Courses.findById(req.params.courseId);
  if (!course)
    return next(new appError("Course Not Found", 404, StatusText.FAIL));
  res.status(200).json({ success: StatusText.SUCCESS, data: course });
});

const createCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(new appError(errors.array(), 400, StatusText.ERROR));

  const newCourse = new Courses(req.body);
  await newCourse.save();
  res
    .status(201)
    .json({ success: StatusText.SUCCESS, data: { course: newCourse } });
});

const updateCourse = asyncWrapper(async (req, res, next) => {
  const course = await Courses.findById(req.params.courseId);
  if (!course)
    return next(new appError("Course Not Found", 404, StatusText.FAIL));

  const updatedCourse = await Courses.findByIdAndUpdate(
    req.params.courseId,
    req.body,
    { new: true }
  );
  res
    .status(200)
    .json({ success: StatusText.SUCCESS, data: { course: updatedCourse } });
});

const deleteCourse = asyncWrapper(async (req, res, next) => {
  const deletedCourse = await Courses.findByIdAndDelete(req.params.courseId);
  if (!deletedCourse) {
    return next(new appError("Course Not Found", 404, StatusText.FAIL));
  }
  res.status(200).json({ success: StatusText.SUCCESS, data: null });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
