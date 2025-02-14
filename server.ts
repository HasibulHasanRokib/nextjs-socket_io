import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`New user connected: ${socket.id}`);

    // Handle user joining a room
    socket.on("join_room", (room: string) => {
      if (!room) {
        socket.emit("error_message", { message: "Room name is required" });
        return;
      }
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
    });

    // Handle sending messages
    socket.on(
      "send_message",
      (data: { room: string; message: string; sender: string }) => {
        const { room, message, sender } = data;
        if (!room || !message || !sender) {
          socket.emit("error_message", { message: "Invalid message data" });
          return;
        }
        console.log(`Message from ${sender} in room ${room}: ${message}`);
        socket
          .to(room)
          .emit("received_message", { message, sender, timestamp: new Date() });
      }
    );

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(
        `> Server listening at http://localhost:${port} as ${
          dev ? "development" : process.env.NODE_ENV
        }`
      );
    });
});
