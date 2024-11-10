import app from "./index";

const PORT = process.env.QUESTION_PORT || 8003;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// server.ts;

// import express, { Application, Request, Response } from "express";
// import mongoose from "mongoose";

// // Create the Express app
// const app: Application = express();
// app.use(express.json()); // Middleware to parse JSON requests

// // MongoDB connection
// const MONGO_URI =
//   "mongodb+srv://jweng88:jwh12345@cluster0.g5j0k.mongodb.net/peerprep";
// mongoose
//   .connect(MONGO_URI, {})
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
//   });

// // Mongoose schema and model for the questions collection
// const questionSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   category: String,
//   complexity: String,
// });

// const Question = mongoose.model("Question", questionSchema);

// // POST endpoint to add a document to the questions collection
// app.post("/api/questions", async (req: Request, res: Response) => {
//   try {
//     const { title, description, category, complexity } = req.body;
//     const newQuestion = new Question({
//       title,
//       description,
//       category,
//       complexity,
//     });
//     await newQuestion.save();
//     res
//       .status(201)
//       .json({ message: "Question added successfully", question: newQuestion });
//   } catch (error) {
//     console.error("Error adding question:", error);
//     res.status(500).json({ error: "Error adding question" });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 8003;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
