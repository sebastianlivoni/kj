const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { SerialPort } = require("serialport");
const bodyparser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
class FIFOQueue {
  constructor() {
    this.queue = [];
    this.maxSize = 10; // Maximum size of the queue
  }

  // Add an element to the front of the queue
  enqueue(item) {
    // If the queue is full, remove the oldest (back) element
    if (this.size() >= this.maxSize) {
      this.dequeue();
    }
    this.queue.unshift(item); // Add the item to the front of the array
  }

  // Remove and return the oldest element (FIFO)
  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.queue.pop(); // Remove from the back (oldest item)
  }

  // Check if the queue is empty
  isEmpty() {
    return this.queue.length === 0;
  }

  // Peek at the oldest element without removing it
  peek() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.queue[this.queue.length - 1]; // Peek at the last (oldest) item
  }

  // Get the current size of the queue
  size() {
    return this.queue.length;
  }
}

const fifoQueue = new FIFOQueue();

// Serve static files (your website)
app.use(express.static("public"));
app.use(bodyparser.json());

app.get("/runestonemessages", (req, res) => {
  res.send(JSON.stringify(fifoQueue.queue));
});

app.post("/runestonemessages", (req, res) => {
  //runemessages.pop().runemessages[0] = req.body.text;
});

// Setup serial port
const port = new SerialPort({
  path: "/dev/tty.usbmodem0010577483543",
  baudRate: 115200,
});

port.on("open", () => {
  console.log("✅ Serial port is open");
});

let buffer = "";

port.on("data", (data) => {
  buffer += data.toString("utf8");

  try {
    // Keep trying to parse JSON as long as there’s something valid in the buffer
    while (true) {
      const start = buffer.indexOf("{");
      const end = buffer.indexOf("}", start);

      if (start === -1 || end === -1) break; // no full object yet

      const potentialJson = buffer.slice(start, end + 1);

      try {
        const json = JSON.parse(potentialJson);

        // Emit the valid JSON object
        io.emit("serial-data", json);
        console.log("✅ Valid JSON sent to clients:", json);

        const { name } = json;
        fifoQueue.enqueue(name);

        // Remove the processed part from the buffer
        buffer = buffer.slice(end + 1);
      } catch {
        // JSON.parse failed — wait for more data
        break;
      }
    }
  } catch (err) {
    console.warn("⚠️ Error processing buffer:", err.message);
  }
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
