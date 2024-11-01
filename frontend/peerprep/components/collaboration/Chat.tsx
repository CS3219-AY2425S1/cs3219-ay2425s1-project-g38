"use client";

import { useRef, useState, useEffect } from "react";
import { Button, Textarea } from "@nextui-org/react";
import { useTheme } from "next-themes";

import { chatMessage } from "@/utils/utils";

interface ChatProps {
  username: string;
  propagateMessage: (message: chatMessage) => void;
  chatHistory: chatMessage[];
}

export default function Chat({
  username: userName,
  propagateMessage,
  chatHistory: messageHistory,
}: ChatProps) {
  const { theme } = useTheme();
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (message) {
      const newMessage: chatMessage = {
        message: message,
        sender: userName,
        timestamp: Date.now(),
      };

      console.log(newMessage);
      propagateMessage(newMessage);
      setMessage("");
    }
  };

  const onTextareaKeyDown = (e: any) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageHistory]);

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col h-full w-full">
      <h2 className="text-lg font-bold">Chat</h2>
      <div className="flex flex-col gap-4 h-full overflow-y-auto p-4 border border-gray-300 rounded-md bg-white dark:bg-gray-800 flex-grow">
        {messageHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.sender === userName ? "items-end" : "items-start"}`}
          >
            <div
              className={`p-2 rounded-md ${msg.sender === userName ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} max-w-[70%] break-words`}
              style={{ wordBreak: "break-word" }} // Ensure long words break
            >
              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              <p
                className={`text-xs ${msg.sender === userName ? "text-left" : "text-right"}`}
              >
                {formatTimestamp(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex flex-row gap-2 mt-4">
        <Textarea
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          minRows={1}
          maxRows={2}
          onKeyDown={onTextareaKeyDown}
          className="flex-grow" // Allow Textarea to grow, while keeping its size reasonable
        />
        <Button
          variant="flat"
          color="success"
          onClick={handleSendMessage}
          className="self-center" // Center the button vertically with the textarea
        >
          Send
        </Button>
      </div>
    </div>
  );
}
