// pages/403.js
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";

import forbiddenImage from "@/images/Forbidden.png";
import BoxIcon from "@/components/boxicons";

const ForbiddenPage = () => {
  const router = useRouter();

  const handleReturnDashboard = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-screen p-10">
      <h1 className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent font-semibold text-2xl mb-4">
        403 Forbidden
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
        Oops! You don&apos;t have permission to access this page.
      </p>
      <img src={forbiddenImage.src} alt="Illustration" className="w-1/5 mb-8" />
      <Button
        onClick={handleReturnDashboard}
        variant="bordered"
        color="secondary"
        startContent={<BoxIcon name="bx-undo" />}
      >
        Return to Dashboard
      </Button>
    </div>
  );
};

export default ForbiddenPage;
