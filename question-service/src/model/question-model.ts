// interface User {
//     id: string;
//     name: string;
//     email: string;
//   }

//   export const users: User[] = [];

import mongoose, { Schema, Document } from "mongoose";
import Counter from "./counter-model";

interface TestCase {
  input: string;
  expectedOutput: string;
}

// Define the schema for a Question
interface QuestionDocument extends Document {
  question_id: number;
  title: string;
  description: string;
  category: string[];
  complexity: string;
  templateCode: string; // New field for the template code
  // testCases: TestCase[]; // New field for test cases (array of test cases)
  testCases: string[]; // New field for test cases (array of test cases)
  language: string; // New field for programming language
  templateCodeYDocUpdate: Buffer; // New field for YDoc update
}

const TestCaseSchema = new Schema<TestCase>({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
});

const questionSchema: Schema = new Schema({
  question_id: { type: Number, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) => v.length > 0 && v.length <= 3, // Allow up to 3 categories
      message: "A question must have between 1 and 3 categories.",
    },
  },
  complexity: { type: String, required: true },
  templateCode: { type: String, required: true }, // Adding template code
  testCases: [{ type: [String], required: false }], // Adding test cases
  language: {
    type: String,
    required: false,
    uppercase: true, // Automatically convert to uppercase
    enum: [
      "TYPESCRIPT",
      "JAVASCRIPT",
      "CSS",
      "LESS",
      "SCSS",
      "JSON",
      "HTML",
      "XML",
      "PHP",
      "CSHARP",
      "CPP",
      "RAZOR",
      "MARKDOWN",
      "DIFF",
      "JAVA",
      "VB",
      "COFFEESCRIPT",
      "HANDLEBARS",
      "BATCH",
      "PUG",
      "FSHARP",
      "LUA",
      "POWERSHELL",
      "PYTHON",
      "RUBY",
      "SASS",
      "R",
      "OBJECTIVE-C",
    ], // Define allowed values
  },
  templateCodeYDocUpdate: { type: Buffer, required: true }, // Adding YDoc update
});

// Middleware to auto-increment the question_id before saving
questionSchema.pre("save", async function (next) {
  const question = this as any;

  if (question.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "questionId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    question.question_id = counter?.seq;
  }

  next();
});

// Add this option to remove __v automatically
questionSchema.set("toJSON", {
  versionKey: false, // This removes the __v field
});

export default mongoose.model<QuestionDocument>("Question", questionSchema);
