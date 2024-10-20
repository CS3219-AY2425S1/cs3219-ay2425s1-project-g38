"use client";

import { useEffect, useState } from "react";

import BoxIcon from "./boxicons";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose }) => {
  const [visible, setVisible] = useState(false); // Controls animation
  const [isMounted, setIsMounted] = useState(true); // Controls component rendering

  useEffect(() => {
    // Trigger the toast appearance after a short delay
    const appearTimeout = setTimeout(() => setVisible(true), 50);

    // Start the hide animation after 5 seconds
    const autoCloseTimeout = setTimeout(() => {
      setVisible(false); // Start the fade-out animation
      setTimeout(() => {
        setIsMounted(false); // Remove component after animation completes
        onClose && onClose();
      }, 500); // 500ms matches the CSS transition duration
    }, 5000);

    return () => {
      clearTimeout(appearTimeout);
      clearTimeout(autoCloseTimeout);
    };
  }, [onClose]);

  const handleClose = () => {
    setVisible(false); // Start fade-out
    setTimeout(() => {
      setIsMounted(false); // Remove component after animation
      onClose && onClose();
    }, 500);
  };

  if (!isMounted) return null; // Prevent rendering after unmount

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-[400px] p-3 rounded-lg shadow-lg
        transition-all duration-500 ease-in-out transform
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}
        ${type === "success" ? "bg-green-500" : ""}
        ${type === "error" ? "bg-red-500" : ""}
        ${type === "info" ? "bg-blue-500" : ""}
        ${type === "warning" ? "bg-yellow-500" : ""}
        text-white flex items-center justify-between text-sm`}
    >
      <span className="text-sm">{message}</span>
      <button onClick={handleClose} className="ml-2">
        <BoxIcon name="bx-x" size="16px" />
      </button>
    </div>
  );
};

export default Toast;
