import { useState } from "react";

export default function JwtTestUI() {
  const [tokenStatus, setTokenStatus] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const verifyToken = async () => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      setTokenStatus("No JWT token found in localStorage.");

      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();

        setTokenStatus("JWT is valid!");
        setUserInfo(data.user);
      } else {
        setTokenStatus("Invalid JWT token.");
      }
    } catch (error) {
      console.error("Error verifying JWT:", error);
      setTokenStatus("Error occurred while verifying token.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-xl font-semibold mb-4">JWT Token Test</h2>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={verifyToken}
      >
        Verify JWT Token
      </button>

      {tokenStatus && (
        <div className="mt-4">
          <p className="text-lg">{tokenStatus}</p>
          {userInfo && (
            <div className="mt-2">
              <p>User ID: {userInfo.user_id}</p>
              <p>Username: {userInfo.username}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
