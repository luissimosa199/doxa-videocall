import express from "express";
import http from "http";
import socketIo from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT: string | number = process.env.PORT || 4000;

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Running");
});

let allUsers: { room: string; id: string; name: string }[] = [];
let roomMessages: {
  [room: string]: { timestamp: number; username: string; message: string }[];
} = {};

io.on("connection", (socket: socketIo.Socket) => {
  console.log("CONECTED");
  socket.emit("me", socket.id);

  socket.on(
    "joinRoomOnConnect",
    (room: string, name: string, callback: () => void) => {
      socket.join(room);
      allUsers.push({ room, id: socket.id, name: name });
      callback();
      socket.emit("message", `You have joined the room: ${room}`);
      socket.to(room).emit("message", `A user has joined the room: ${room}`);

      // After a user joins, send the updated list of users to everyone in the room
      const usersInRoom = allUsers.filter((user) => user.room === room);
      io.to(room).emit("usersInRoom", usersInRoom); // Use io.to(room) to send to everyone in the room
    }
  );

  socket.on("getUsersInRoom", (room: string) => {
    const usersInRoom = allUsers.filter((user) => user.room === room);
    socket.emit("usersInRoom", usersInRoom);
  });
  //
  socket.on("sendMessage", ({ room, username, message }) => {
    const timestamp = Date.now();

    if (!roomMessages[room]) {
      roomMessages[room] = [];
    }

    roomMessages[room].push({ timestamp, username, message });

    // Broadcast the updated list of messages to everyone in the room
    io.to(room).emit("roomMessages", roomMessages[room]);
  });

  socket.on("getRoomMessages", (room, callback) => {
    callback(roomMessages[room] || []);
  });
  //
  socket.on("disconnect", () => {
    const user = allUsers.find((user) => user.id === socket.id);
    allUsers = allUsers.filter((user) => user.id !== socket.id);

    if (user) {
      // After a user disconnects, send the updated list of users to the remaining users in the room
      const usersInRoom = allUsers.filter((u) => u.room === user.room);
      io.to(user.room).emit("usersInRoom", usersInRoom);
    }

    socket.broadcast.emit("callEnded");
  });

  socket.on(
    "callRoom",
    ({
      roomToCall,
      signalData,
      from,
      name,
    }: {
      roomToCall: string;
      signalData: any;
      from: string;
      name: string;
    }) => {
      io.to(roomToCall).emit("callRoom", { signal: signalData, from, name });
    }
  );

  socket.on("answerCall", (data: { room: string; signal: any }) => {
    io.to(data.room).emit("callAccepted", data.signal);
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
