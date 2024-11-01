"use client";

import { useRef, useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@nextui-org/react";
import { useTheme } from "next-themes";

import { chatMessage } from "@/utils/utils";

interface ChatModalProps {
    username: string;
    propagateMessage: (message: chatMessage) => void;
    chatHistory: chatMessage[];
}

export default function ChatModal({
    username: userName,
    propagateMessage,
    chatHistory: messageHistory,
}: ChatModalProps) {
    const { theme } = useTheme();
    const [message, setMessage] = useState<string>("");
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

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

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messageHistory]);

    const formatTimestamp = (timestamp: number): string => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className="flex justify-start items-center h-full w-full">
            <Button className="flex w-full" variant="flat" color="primary" onClick={handleOpenModal}>
                Chat Here!
            </Button>
            <Modal
                isOpen={isModalVisible}
                onClose={handleCloseModal}
                title=""
                aria-labelledby="Chat Modal"
                aria-describedby="Modal to chat with your peer"
            >
                <ModalContent>
                    <ModalHeader className="font-sans flex flex-col pt-8">
                        <p className="text-xl font-bold pb-2 text-center">
                            Chat with your peer!
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 h-64 overflow-y-auto">
                                {messageHistory.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${msg.sender === userName ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`p-2 rounded-md ${msg.sender === userName
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-300 text-black"
                                                }`}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center">
                                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                                <p className="text-xs text-right sm:ml-2 sm:mt-0 mt-1">
                                                    {formatTimestamp(msg.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="message" className="text-sm font-bold">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="flex flex-row justify-center items-center w-full">
                            <Button
                                className=""
                                variant="flat"
                                color="success"
                                onClick={handleSendMessage}
                            >
                                Send
                            </Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}