import React, { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

interface MessageData {
  room: string;
  sender: string;
  message: string;
  timestamp: Date;
}

interface ChatProps {
  userName: string;
  room: string;
}

export default function Chat({ userName, room }: ChatProps) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<MessageData[]>([]);

  const sendMessage = () => {
    if (currentMessage.trim() !== "") {
      const messageData: MessageData = {
        room,
        sender: userName,
        message: currentMessage,
        timestamp: new Date(),
      };
      socket.emit("send_message", messageData);
      setMessageList((prev) => [...prev, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("received_message", (data: MessageData) => {
      setMessageList((prev) => [...prev, data]);
    });
    return () => {
      socket.off("received_message");
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">Live Chat</h2>
      <div className="h-64 overflow-y-auto border border-gray-700 rounded p-2 mb-4">
        {messageList.map((item, index) => (
          <div key={index} className="p-2 bg-gray-700 rounded my-1">
            <p className="text-sm text-gray-300">
              {item.sender} ({item.timestamp.toLocaleString()})
            </p>
            <p>{item.message}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          onClick={sendMessage}
        >
          &#9658;
        </button>
      </div>
    </div>
  );
}
