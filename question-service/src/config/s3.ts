import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // Ensure you use the right region
});

export const uploadToS3 = async (file: Express.Multer.File) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string, // S3 bucket name
    Key: `${Date.now()}_${file.originalname}`, // Unique file name
    Body: file.buffer, // File buffer from multer's memoryStorage
    ContentType: file.mimetype,
  };

  const data = await s3.upload(params).promise();
  return data.Location; // Returns the file URL after upload
};

export const deleteFromS3 = async (key: string) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: key,
  };

  await s3.deleteObject(params).promise();
};
