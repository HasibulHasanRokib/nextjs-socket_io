"use client";

import { useState } from "react";
import { socket } from "@/lib/socket";
import Chat from "@/components/chat";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [show, setShow] = useState(false);

  const handleJoinRoom = () => {
    if (userName.trim() !== "" && room.trim() !== "") {
      socket.emit("join_room", room);
      setShow(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {!show ? (
        <div className="bg-white p-8 rounded-2xl shadow-md w-96">
          <h1 className="text-2xl font-bold text-center mb-4">Join a Chat</h1>
          <input
            type="text"
            name="user"
            id="user"
            placeholder="Enter user name"
            className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUserName(e.target.value)}
          />

          <input
            type="text"
            name="room"
            id="room"
            placeholder="Enter room"
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setRoom(e.target.value)}
          />

          <button
            onClick={handleJoinRoom}
            disabled={!userName || !room}
            className={`w-full py-2 text-white font-bold rounded-lg ${
              userName && room
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Join
          </button>
        </div>
      ) : (
        <Chat userName={userName} room={room} />
      )}
    </div>
  );
}
