import multer from "multer";
import path from "path";

// Define storage settings
const storage = multer.memoryStorage(); // Store files in memory to directly upload to S3

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

export default upload;

// import multer from "multer";
// import multerS3 from "multer-s3";
// import s3 from "../config/s3";

// // Set up the multer middleware with S3 storage
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.S3_BUCKET_NAME,
//     acl: "public-read", // make the files publicly readable (optional)
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       cb(null, `questions/${Date.now().toString()}-${file.originalname}`);
//     },
//   }),
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
// });

// export default upload;
