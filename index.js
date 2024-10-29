// Required imports
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const StatusText = require("./utils/StatusText");
const coursesRouter = require("./Routers/courses.route");
const usersRouter = require("./Routers/users.route");
const path = require("path");

// App and Database configuration
const app = express();
const url = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;
// Middleware
app.use("./Uploads", express.static(path.join(__dirname, "./Uploads")));
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Routes
app.use("/api/courses", coursesRouter);
app.use("/api", usersRouter); // Users routes are now under /api

// Handle undefined routes
app.all("*", (req, res) => {
  res.status(404).json({
    status: StatusText.ERROR,
    data: null,
    msg: "This resource is not available",
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const statusText = error.statusText || StatusText.ERROR;
  res.status(statusCode).json({ status: statusText, msg: error.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
