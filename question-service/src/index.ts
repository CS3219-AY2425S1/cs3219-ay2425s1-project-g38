import express, { Application } from "express";
import mongoose from "mongoose";
import router from "./routes/question-routes";
import authMiddleware from "./middleware/question-middleware";
import "dotenv/config";

const app: Application = express();

// console.log("MONGODB_URI: ", process.env.MONGODB_URI);
// Middleware
app.use(express.json());
// app.use(authMiddleware);
var cors = require('cors');
app.use(cors());


// MongoDB connection
mongoose
  .connect(process.env.QUESTION_MONGODB_URI as string, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

// Routes
app.use("/api/questions", router);

export default app;
