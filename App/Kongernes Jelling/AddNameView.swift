import SwiftUI

struct AddNameView: View {
    @State private var inputText = "" // Store the text input from the user
    @State private var originalText = "" // Store the text input from the user
    
    private var central = Central()

    // Rune conversion function for each letter
    func runeConverter(for letter: String) -> String? {
        let letter = letter.lowercased()
        
        switch letter {
        case "a", "æ":
            return "ᛅ"
        case "b", "p":
            return "ᛒ"
        case "c", "s", "z":
            return "ᛋ"
        case "d", "t":
            return "ᛏ"
        case "e", "i", "j":
            return "ᛁ"
        case "f":
            return "ᚠ"
        case "g", "k", "q":
            return "ᚴ"
        case "h":
            return "ᚼ"
        case "l":
            return "ᛚ"
        case "m":
            return "ᛙ"
        case "n":
            return "ᚾ"
        case "o", "u", "v", "w", "y", "ø":
            return "ᚢ"
        case "r":
            return "ᚱ"
        case "x":
            return "ᚴᛋ"
        case "å":
            return "ᚭ"
        default:
            print("Not a letter")
            return nil
        }
    }
    
    // Create the keyboard layout for A-Z plus special characters
    let rows: [[String]] = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["æ", "z", "x", "c", "v", "b", "n", "m", "ø", "å"]
    ]

    var body: some View {
        VStack {
            // Display the entered text
            VStack {
                Text("Entered Text:")
                Text(inputText)
            }
            .padding()
            .font(.title)
            
            // Add a Spacer before the keyboard for some spacing
            Spacer()

            // Use LazyVGrid for the keyboard layout
            LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 5), count: 6), spacing: 10) {
                ForEach(rows.flatMap { $0 }.sorted(), id: \.self) { letter in
                    Button(action: {
                        if let rune = runeConverter(for: letter) {
                            inputText += rune // Append the rune corresponding to the letter
                            originalText += letter
                        }
                    }) {
                        Text(letter)
                            .font(.system(size: 30))
                            .frame(width: 40, height: 40)
                            .background(Circle().fill(Color.blue))
                            .foregroundColor(.white)
                            .shadow(radius: 5)
                    }
                }
            }
            .padding(.horizontal)
            
            // Send button to perform action with the input text
            Button(action: {
                // You can send or process the entered text here
                print("Text Sent: \(originalText)")
                
                let obj = [
                    "name": originalText,
                    "lat": 0,
                    "long": 0
                ]
                
                inputText = ""
                originalText = ""
                
                guard let jsonData = try? JSONSerialization.data(withJSONObject: obj) else {
                    return
                }
                
                central.sendData(data: jsonData)
            }) {
                Text("Send Text")
                    .font(.title)
                    .padding()
                    .background(Capsule().fill(Color.green))
                    .foregroundColor(.white)
                    .shadow(radius: 5)
            }
            .padding(.top)

        }
        .padding()
    }
}

#Preview {
    AddNameView()
}
