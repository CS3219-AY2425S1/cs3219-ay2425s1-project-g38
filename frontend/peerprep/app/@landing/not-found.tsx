// pages/403.js
import React from "react";
import { Button } from "@nextui-org/button";
import Link from "next/link";

import errorImage from "../../images/404.png";

import BoxIcon from "@/components/boxicons";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center min-h-screen w-screen p-10">
      <h1 className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent font-semibold text-2xl mb-4">
        Error 404
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
        Oops! The page you are looking for does not exists!
      </p>
      <img src={errorImage.src} alt="Illustration" className="w-1/5 mb-8" />
      <Link href="/" passHref>
        <Button
          variant="bordered"
          color="secondary"
          startContent={<BoxIcon name="bx-undo" />}
        >
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}
