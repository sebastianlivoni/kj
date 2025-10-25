class FIFOQueue {
  constructor() {
    this.queue = [];
    this.maxSize = 5; // Maximum size of the queue
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

/* --- Rune Converter Functions --- */
function RuneConverter(letter) {
  let rune;
  letter = letter.toLowerCase();
  switch (letter) {
    case "a":
    case "æ":
      rune = "ᛅ";
      break;
    case "b":
    case "p":
      rune = "ᛒ";
      break;
    case "c":
    case "s":
    case "z":
      rune = "ᛋ";
      break;
    case "d":
    case "t":
      rune = "ᛏ";
      break;
    case "e":
    case "i":
    case "j":
      rune = "ᛁ";
      break;
    case "f":
      rune = "ᚠ";
      break;
    case "g":
    case "k":
    case "q":
      rune = "ᚴ";
      break;
    case "h":
      rune = "ᚼ";
      break;
    case "l":
      rune = "ᛚ";
      break;
    case "m":
      rune = "ᛙ";
      break;
    case "n":
      rune = "ᚾ";
      break;
    case "o":
    case "u":
    case "v":
    case "w":
    case "y":
    case "ø":
      rune = "ᚢ";
      break;
    case "r":
      rune = "ᚱ";
      break;
    case "x":
      rune = "ᚴᛋ";
      break;
    case "å":
      rune = "ᚭ";
      break;
    default:
      rune = " ";
  }
  return rune;
}

function RuneTransliterator(word) {
  return [...word].map(RuneConverter).join("");
}

/* --- DOM Interaction --- */
const fifoQueue = new FIFOQueue(10);

function renderQueue() {
  const textbox = document.getElementById("textBox");
  textbox.innerHTML = ""; // Clear previous messages

  fifoQueue.queue.forEach((element) => {
    const runicMessage = RuneTransliterator(element);
    const div = document.createElement("div");
    div.textContent = runicMessage;
    textbox.appendChild(div);
  });
}

/* --- Initial Fetch --- */
document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("//localhost:3000/runestonemessages");
  const data = await res.json();

  // Fill the queue and render
  data.forEach((msg) => fifoQueue.enqueue(msg));
  renderQueue();
});

/* --- Server-Sent Events --- */
const evtSource = new EventSource("//localhost:3000/runestonemessages");
evtSource.onmessage = (event) => {
  fifoQueue.enqueue(event.data);
  renderQueue();
};

/* --- Socket.io --- */
const socket = io();
socket.on("serial-data", (msg) => {
  fifoQueue.enqueue(msg.name);
  renderQueue();
});
