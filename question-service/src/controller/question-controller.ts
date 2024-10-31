// import { Request, Response } from 'express';

// export const templateController = {
//   home: (req: Request, res: Response) => {
//     res.send('Welcome to Question Service!');
//   },
// };

import { Request, Response } from 'express';
import Question from '../model/question-model';
import { uploadToS3, deleteFromS3 } from '../config/s3';

export const questionController = {
  // Create a question
  createQuestion: async (req: Request, res: Response) => {
    const {
      title,
      description,
      category,
      complexity,
      templateCode,
      testCases,
      language,
      templateCodeYDocUpdate,
    } = req.body;

    // Check if all fields are provided
    if (!title || !description || !category || !complexity || !language) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Enforce a character limit of 80 characters for the title
    if (title.length > 80) {
      return res
        .status(400)
        .json({ error: 'Question title cannot exceed 80 characters.' });
    }

    if (
      !templateCode ||
      !testCases /*|| !Array.isArray(testCases)*/ ||
      !templateCodeYDocUpdate
    ) {
      return res
        .status(400)
        .json({ error: 'Invalid input for template code or test cases' });
    }

    // Convert language to uppercase and validate
    const languageUpperCase = language.toUpperCase();
    const validLanguages = [
      'TYPESCRIPT',
      'JAVASCRIPT',
      'PHP',
      'CSHARP',
      'JAVA',
      'PYTHON',
    ];

    if (!validLanguages.includes(languageUpperCase)) {
      return res.status(400).json({
        error: `Invalid language. Allowed languages: ${validLanguages.join(
          ', '
        )}.`,
      });
    }

    try {
      // Check for duplicates based on the question title
      const existingQuestion = await Question.findOne({
        title: { $regex: `^${title}$`, $options: 'i' }, // Case-insensitive exact match
      });
      if (existingQuestion) {
        return res
          .status(400)
          .json({ error: 'A question with this title already exists.' });
      }

      // Parse the testCases if they are sent as a JSON string
      // if (typeof req.body.testCases === "string") {
      //   req.body.testCases = JSON.parse(req.body.testCases);
      // }

      // // Handle image upload if present
      // let updatedDescription = description;
      // if (req.files) {
      //   const files = req.files as Express.Multer.File[];
      //   for (const file of files) {
      //     const imageUrl = await uploadToS3(file);
      //     updatedDescription += `\n![Image](${imageUrl})`; // Append image URL at the end of description
      //   }
      // }

      const question = new Question({
        title: title,
        // description: updatedDescription,
        description: description,
        category: Array.isArray(category)
          ? category.map((cat) => cat.toUpperCase())
          : category.toUpperCase(), // Convert each category string to uppercase
        complexity: complexity.toUpperCase(),
        templateCode: templateCode,
        testCases: req.body.testCases,
        language: languageUpperCase,
        templateCodeYDocUpdate: templateCodeYDocUpdate,
      });

      const savedQuestion = await question.save();
      res.status(201).json(savedQuestion);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create question' });
    }
  },

  // Get all questions
  getAllQuestions: async (req: Request, res: Response) => {
    try {
      const {
        question_id,
        title,
        // description,
        category,
        complexity,
        // templateCode,
        // testCase,
        // testCaseInput,
        // testCaseOutput,
        sort,
      } = req.query;

      // Set default values for pagination
      const page = parseInt(req.query.page as string) || 1; // default to page 1
      const limit = parseInt(req.query.limit as string) || 10; // default to 10 items per page
      const skip = Number(page - 1) * Number(limit);

      // Construct the filter object dynamically based on provided query params
      const filter: any = {};

      if (question_id) {
        filter.question_id = question_id;
      }
      if (title) {
        filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
      }
      // if (description) {
      //   filter.description = { $regex: description, $options: "i" };
      // }
      // if (category) {
      //   filter.category = {
      //     $in: Array.isArray(category) ? category : [category],
      //   };
      // }

      if (category) {
        const categoriesArray = Array.isArray(category) ? category : [category];
        filter.category = {
          $in: categoriesArray.map((cat) => new RegExp(cat as string, 'i')), // Convert each category to case-insensitive regex
        };
      }

      if (complexity) {
        filter.complexity = { $regex: complexity, $options: 'i' }; // Case-insensitive;
      }
      // if (templateCode) {
      //   filter.templateCode = { $regex: templateCode, $options: "i" };
      // }

      // // Fetch the filtered and paginated results
      // const questions = await Question.find(filter)
      //   .skip(skip)
      //   .limit(Number(limit));

      // // Default sorting
      // let sortOptions: any = {};

      // // Sorting by title
      // if (sort === "title" || sort === "-title") {
      //   sortOptions.title = sort === "title" ? 1 : -1; // Ascending for 'title', descending for '-title'
      // }

      // // Sorting by complexity using numerical values for custom ordering
      // if (sort === "complexity" || sort === "-complexity") {
      //   const complexityOrder = { Easy: 1, Medium: 2, Hard: 3 };
      //   sortOptions.complexity =
      //     sort === "complexity"
      //       ? complexityOrder
      //       : { Easy: -1, Medium: -2, Hard: -3 };
      // }

      // Construct sort options dynamically based on `sort` parameter
      let sortOptions: any = {};
      const complexityOrder = { EASY: 1, MEDIUM: 2, HARD: 3 }; // Numerical values for complexity ordering

      // Sort by title (ascending or descending)
      if (sort === 'title' || sort === '-title') {
        sortOptions.title = sort === 'title' ? 1 : -1; // Ascending (1) or Descending (-1)
      }

      // Sort by complexity using numerical values for ordering
      if (sort === 'complexity' || sort === '-complexity') {
        sortOptions.complexity = sort === 'complexity' ? 1 : -1; // Ascending (1) or Descending (-1)

        // Use aggregation to apply custom sorting for complexity field based on defined order
        const complexitySortOrder = sort === 'complexity' ? 1 : -1;

        // Use the aggregation framework to define sorting based on custom complexity order
        const questions = await Question.aggregate([
          { $match: filter }, // Apply the filter criteria
          {
            $addFields: {
              // Create a new field for sorting based on custom complexity values
              complexityOrder: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ['$complexity', 'EASY'] },
                      then: complexityOrder.EASY,
                    },
                    {
                      case: { $eq: ['$complexity', 'MEDIUM'] },
                      then: complexityOrder.MEDIUM,
                    },
                    {
                      case: { $eq: ['$complexity', 'HARD'] },
                      then: complexityOrder.HARD,
                    },
                  ],
                  default: 0,
                },
              },
            },
          },
          {
            $sort: {
              complexityOrder: complexitySortOrder,
              title: sortOptions.title || 1,
            },
          }, // Sort based on complexity order and then by title
          { $skip: skip }, // Apply pagination
          { $limit: limit },
          {
            $project: {
              question_id: 1,
              title: 1,
              category: 1,
              complexity: 1,
            },
          },
        ]);

        // Count total number of documents matching the filter
        const totalQuestions = await Question.countDocuments(filter);
        return res.status(200).json({
          questions,
          totalQuestions,
          currentPage: page,
          totalPages: Math.ceil(totalQuestions / limit),
        });
      }

      // Fetch only the fields you need: question_id, title, category, complexity
      const questions = await Question.find(filter)
        .select('question_id title category complexity') // Specify fields to fetch
        .sort(sortOptions) // Apply sorting
        .skip(skip)
        .limit(limit);

      // // Define complexity order for sorting
      // const complexityOrder: { [key: string]: number } = {
      //   EASY: 1,
      //   MEDIUM: 2,
      //   HARD: 3,
      // };

      // // Apply sorting in the application layer
      // if (sort === "complexity") {
      //   questions.sort((a: any, b: any) => {
      //     return complexityOrder[a.complexity] - complexityOrder[b.complexity];
      //   });
      // } else if (sort === "-complexity") {
      //   questions.sort((a: any, b: any) => {
      //     return complexityOrder[b.complexity] - complexityOrder[a.complexity];
      //   });
      // } else if (sort === "title") {
      //   questions.sort((a: any, b: any) => a.title.localeCompare(b.title)); // Ascending
      // } else if (sort === "-title") {
      //   questions.sort((a: any, b: any) => b.title.localeCompare(a.title)); // Descending
      // }

      // Count total number of documents matching the filter
      const totalQuestions = await Question.countDocuments(filter);
      res.status(200).json({
        questions,
        totalQuestions,
        currentPage: page,
        totalPages: Math.ceil(totalQuestions / limit),
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get questions' });
    }
  },

  // Get question by ID
  getQuestionById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const question = await Question.findOne({ question_id: id });
      if (question) {
        res.status(200).json({ question });
      } else {
        res.status(404).json({ message: 'Question not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to get question' });
    }
  },

  // Update a question
  updateQuestion: async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      complexity,
      templateCode,
      testCases,
      language,
      templateCodeYDocUpdate,
    } = req.body;

    // Check if all fields are provided
    if (!title || !description || !category || !complexity || !language) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Enforce a character limit of 80 characters for the title
    if (title.length > 80) {
      return res
        .status(400)
        .json({ error: 'Question title cannot exceed 80 characters.' });
    }

    if (
      !templateCode ||
      !testCases /*|| !Array.isArray(testCases)*/ ||
      !templateCodeYDocUpdate
    ) {
      return res
        .status(400)
        .json({ error: 'Invalid input for template code or test cases' });
    }

    // Convert language to uppercase and validate
    const languageUpperCase = language.toUpperCase();
    const validLanguages = [
      'TYPESCRIPT',
      'JAVASCRIPT',
      'PHP',
      'CSHARP',
      'JAVA',
      'PYTHON',
    ];

    if (!validLanguages.includes(languageUpperCase)) {
      return res.status(400).json({
        error: `Invalid language. Allowed languages: ${validLanguages.join(
          ', '
        )}.`,
      });
    }

    try {
      // const updatedQuestion = await Question.findOneAndUpdate(
      //   { question_id: id },
      //   { title, description, category, complexity, templateCode, testCases },
      //   { new: true } // Return the updated document
      // );

      const question = await Question.findOne({ question_id: id });
      if (!question)
        return res.status(404).json({ message: 'Question not found' });
      // Check for duplicate titles, case-insensitive, excluding the current question
      const duplicateTitleCheck = await Question.findOne({
        title: { $regex: `^${title}$`, $options: 'i' }, // Case-insensitive exact match
        _id: { $ne: question._id }, // Exclude the current question from the duplicate check
      });

      if (duplicateTitleCheck) {
        return res
          .status(400)
          .json({ error: 'A question with this title already exists.' });
      }

      // let updatedDescription = description;
      // if (req.files) {
      //   const files = req.files as Express.Multer.File[];
      //   for (const file of files) {
      //     const imageUrl = await uploadToS3(file);
      //     updatedDescription += `\n![Image](${imageUrl})`; // Append new image URL to description
      //   }
      // }

      question.title = title || question.title;
      // question.description = updatedDescription || question.description;
      question.description = description || question.description;
      question.category = Array.isArray(category)
        ? category.map((cat) => cat.toUpperCase())
        : category.toUpperCase() || question.category;
      question.complexity = complexity.toUpperCase() || question.complexity;
      question.templateCode = templateCode || question.templateCode;
      question.testCases = testCases || question.testCases;
      question.language = languageUpperCase /*|| question.language*/;
      question.templateCodeYDocUpdate =
        templateCodeYDocUpdate || question.templateCodeYDocUpdate;

      await question.save();
      res.status(200).json(question);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update question' });
    }
  },

  // Delete a question
  deleteQuestion: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const question = await Question.findOne({ question_id: id });
      if (!question)
        return res.status(404).json({ message: 'Question not found' });
      // const deletedQuestion = await Question.findOneAndDelete({
      //   question_id: id,
      // });

      // // Extract image URLs from the description and delete them from S3
      // const imageUrls = question.description
      //   .match(/!\[Image]\((.*?)\)/g)
      //   ?.map((img) => img.slice(9, -1));
      // if (imageUrls) {
      //   for (const imageUrl of imageUrls) {
      //     const key = imageUrl.split("/").pop() as string;
      //     await deleteFromS3(key);
      //   }
      // }

      await question.delete();
      res.status(200).json({ message: 'Question deleted successfully' });

      // if (deletedQuestion) {
      //   res.status(200).json({ message: "Question deleted successfully" });
      // } else {
      //   res.status(404).json({ message: "Question not found" });
      // }
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete question' });
    }
  },

  // Get all unique categories (topics)
  getAllUniqueCategories: async (req: Request, res: Response) => {
    try {
      // Use MongoDB's distinct to retrieve unique category values
      const uniqueCategories = await Question.distinct('category');

      res.status(200).json({ uniqueCategories });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get unique categories' });
    }
  },

  // Get all unique complexity levels
  getAllUniqueComplexityLevels: async (req: Request, res: Response) => {
    try {
      // Use MongoDB's distinct to retrieve unique complexity values
      const uniqueComplexityLevels = await Question.distinct('complexity');

      res.status(200).json({ uniqueComplexityLevels });
    } catch (err) {
      res.status(500).json({
        error: 'Failed to get unique complexity levels',
      });
    }
  },

  // New: Retrieve a question based on difficulty and category
  getQuestionByCriteria: async (req: Request, res: Response) => {
    try {
      const { difficulty, category } = req.body;

      // Validate request body
      if (!difficulty || !category) {
        return res
          .status(400)
          .json({ error: "Both 'difficulty' and 'category' are required." });
      }

      // Helper function to select a random value from an array
      const getRandomValue = (input: string | string[]) =>
        Array.isArray(input)
          ? input[Math.floor(Math.random() * input.length)]
          : input;

      // Randomly select a difficulty and category if they are arrays
      const selectedDifficulty = getRandomValue(difficulty).toUpperCase();
      const selectedCategory = getRandomValue(category).toUpperCase();

      // Step 1: Try to find a question that matches both criteria
      let question = await Question.aggregate([
        {
          $match: {
            complexity: selectedDifficulty,
            category: selectedCategory,
          },
        },
        { $sample: { size: 1 } }, // Randomly select one question
      ]);

      // Step 2: If no question matches both criteria, match by one field
      if (!question.length) {
        question = await Question.aggregate([
          {
            $match: {
              $or: [
                { complexity: selectedDifficulty },
                { category: selectedCategory },
              ],
            },
          },
          { $sample: { size: 1 } }, // Randomly select one question
        ]);
      }

      // Step 3: Handle if no question is found even by single criteria
      if (!question.length) {
        return res.status(404).json({
          error: 'No question found matching the given difficulty or category.',
        });
      }

      res.status(200).json({ question: question[0] });
    } catch (error) {
      console.error('Error retrieving question:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while retrieving the question.' });
    }
  },
};
