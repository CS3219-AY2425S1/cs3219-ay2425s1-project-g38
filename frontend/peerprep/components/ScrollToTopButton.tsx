import { useState, useEffect } from "react";
import BoxIcon from "./boxicons";

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      className={`fixed bottom-12 right-20 z-50 flex items-center justify-center w-8 h-8 rounded-full border-none bg-gray-500 text-white transition-opacity transition-transform transition-shadow duration-200 ease-in-out ${
        isVisible
          ? "opacity-60 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      } hover:opacity-90 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-md`}
      onClick={scrollToTop}
    >
      <BoxIcon name="bx-chevron-up" size="20px" />
    </button>
  );
};
