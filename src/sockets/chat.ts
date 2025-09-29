import { WebSocketServer } from "ws";

export default function chatSocket(wss: WebSocketServer) {
  wss.on("connection", (ws) => {
    console.log("Client was connected");

    ws.on("message", (data) => {
      //Broadcast to everyone
      for (const client of wss.clients) {
        if (client.readyState === 1) client.send(data.toString());
      }
    });

    ws.on("close", () => console.log("Client WS discconected"));
  });
}
