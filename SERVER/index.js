 // Load env variables
require("dotenv").config();

const express = require("express");
const app = express();

// Routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payment");
// const categoryRoutes = require("./routes/Category");
const contactUsRoute = require("./routes/ContactUs");

// Config
const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// Middleware
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// Server PORT
// console.log(process.env.PORT);
const PORT = process.env.PORT || 4000;

// Connect DB
database.connect();

// Cloudinary Setup
cloudinaryConnect();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", // your react aapp
    credentials: true, 
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Mount Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
// app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/contact",contactUsRoute);
// Default route
app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "Your server is up and running...",
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "This route does not exist",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});

