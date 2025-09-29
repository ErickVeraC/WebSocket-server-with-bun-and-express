import app from "./app";
import mongoose from "mongoose";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import chatSocket from "./sockets/chat";

//Read the variables
const PORT = Number(Bun.env.port ?? process.env.PORT ?? 4000);
const MONGO =
  Bun.env.MONGO_URI ??
  process.env.MONGO_URI ??
  "mongodb://127.0.0.1:27017/bun-express-ws";

//Mongo conection
try {
  await mongoose.connect(MONGO);
  console.log("Conection with DB has been succesfully");
} catch (err) {
  console.warn("It could been possible to connect with MongoDB");
}

//Create the server http to get attach the WebSocket
const server = createServer(app as any);

//WebSocket server in the same conection (ruta/ws)
const wss = new WebSocketServer({ server, path: "/ws" });
chatSocket(wss);

server.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
  console.log(`WebSocket endpoint ws://localhost:${PORT}/ws`);
});
