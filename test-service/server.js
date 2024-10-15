const express = require("express");
require('dotenv').config();
const { verifyToken } = require("@clerk/backend");
const cors = require("cors");

const app = express();
app.use(cors()); // Ensure your frontend's origin is permitted
app.use(express.json());

app.post("/api/verify-token", async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ error: "Token not found. User must sign in." });
  }

  try {
    // Verify the token using Clerk's verifyToken function
    console.log(token)
    console.log(`jwtKey: ${process.env.CLERK_JWT_KEY}`)
    const verifiedToken = await verifyToken(token, {
      jwtKey: process.env.CLERK_JWT_KEY,
    });

    // Extract user details from the verified token
    console.log(verifiedToken)
    res.status(200).json({
      message: "JWT is valid!",
      result: { verifiedToken },
    });
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).json({ error: "Token not verified." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`JWT verification backend running on port ${PORT}`)
);
