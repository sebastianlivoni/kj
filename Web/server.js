import express from "express";
import http from "http";
import { Server } from "socket.io";
import { SerialPort } from "serialport";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (your website)
app.use(express.static("public"));

// Setup serial port
const port = new SerialPort({
  path: "/dev/tty.usbmodem0010577483543",
  baudRate: 115200,
});

port.on("open", () => {
  console.log("✅ Serial port is open");
});

port.on("data", (data) => {
  const message = data.toString("utf8");
  console.log("Received:", message);

  // Send data to all connected web clients
  io.emit("serial-data", message);
});

port.on("error", (err) => {
  console.error("Serial port error:", err.message);
});

// WebSocket connection
io.on("connection", (socket) => {
  console.log("⚡ Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
