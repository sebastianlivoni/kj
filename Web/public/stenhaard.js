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
      console.log("Not a letter");
  }
  return rune;
}

function RuneTransliterator(word) {
  const iterator = word[Symbol.iterator]();
  let theChar = iterator.next();
  let runeWord = "";

  while (!theChar.done) {
    runeWord = runeWord.concat(RuneConverter(theChar.value));
    theChar = iterator.next();
  }
  return runeWord;
}

function createMessageText(messages){
    textbox = document.getElementById("textBox");
    messages.forEach(element => {
        runicMessage = RuneTransliterator(element);
        let newDiv = document.createElement("div");
        newDiv.appendChild(document.createTextNode(runicMessage));
        textbox.appendChild(newDiv);
    });
}

document.addEventListener("DOMContentLoaded", async (event)=>{
    let response = await fetch("//localhost:3000/runestonemessages");
    response = await response.json();
    createMessageText(response);
})

let textfield = document.getElementById("userMessage");
textfield.addEventListener("keyup", async ({key})=>{
    if (key == "Enter"){
        await fetch("//localhost:3000/runestonemessages",{method: "POST", headers:{'Content-Type': 'application/json'}, body: JSON.stringify({text: textfield.value})})
    }
})

const evtSource = new EventSource("//localhost:3000/runestonemessages");

evtSource.onmessage = (event) =>{
    createMessageText(event.data);
}