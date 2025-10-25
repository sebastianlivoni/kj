//
//  ContentView.swift
//  Kongernes Jelling
//
//  Created by Sebastian on 24/10/2025.
//

import SwiftUI
import WebKit

private class DialogPresenter: WebPage.DialogPresenting {
    var promptHandler: (() async -> String)?
    
    func handleJavaScriptPrompt(message: String, defaultText: String?, initiatedBy frame: WebPage.FrameInfo) async -> WebPage.JavaScriptPromptResult {
        print("hello wolrd")
        
        guard let result = await promptHandler?() else {
            return .cancel
        }
        
        return .ok(result)
    }
}

class MessageHandler: NSObject, WKScriptMessageHandler {
    var lat: Double?
    var lng: Double?
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if let body = message.body as? [String: Any],
           let lat = body["lat"] as? Double,
           let lng = body["lng"] as? Double {
            print("Received coordinates: lat \(lat), lng \(lng)")
            
            self.lat = lat
            self.lng = lng
        } else {
            print("Unexpected message body: \(message.body)")
        }
    }
}

struct ContentView: View {
    private var central = Central()
    
    @State private var page: WebPage
    private var dialogPresenter: DialogPresenter = .init()
    private var messageHandler: MessageHandler = .init()
    
    @State private var name: String = ""
    @State private var showAlert: Bool = false
    @State private var showingAlert: Bool = false
    @State private var submitHandler: (() -> Void)?
    @State private var skipHandler: (() -> Void)?
    
    init() {
        var configuration = WebPage.Configuration()
                
        var navigationPreference = WebPage.NavigationPreferences()
        
        configuration.userContentController.add(messageHandler, name: "test")
        
        navigationPreference.allowsContentJavaScript = true
        navigationPreference.preferredHTTPSNavigationPolicy = .keepAsRequested
        navigationPreference.preferredContentMode = .mobile
        configuration.defaultNavigationPreferences = navigationPreference

        let page = WebPage(configuration: configuration, dialogPresenter: dialogPresenter)
        
        self.page = page
    }
    
    var body: some View {
        WebView(page)
            .onAppear {
                if let url = Bundle.main.url(forResource: "index", withExtension: "html") {
                    guard let contents = try? String(contentsOfFile: url.path, encoding: .utf8) else {
                        return
                    }
                    let baseUrl = url.deletingLastPathComponent()
                    page.load(html: contents, baseURL: baseUrl)
                }
                
                dialogPresenter.promptHandler = {
                    await withCheckedContinuation { continuation in
                        Task { @MainActor in
                            showingAlert = true
                            
                            let submitAction = {
                                showingAlert = false
                                continuation.resume(returning: name)
                            }
                            
                            let skipAction = {
                                showingAlert = false
                                continuation.resume(returning: "")
                            }

                            self.submitHandler = submitAction
                            self.skipHandler = skipAction
                        }
                    }
                }
            }
            .ignoresSafeArea()
            .alert("Alert Title!", isPresented: $showingAlert) {
                TextField("Enter name", text: $name)
                Button("Submit") {
                    Task {
                        submitHandler?()
                        
                        let obj = [
                            "name": name,
                            "lat": messageHandler.lat,
                            "long": messageHandler.lng
                        ]
                        
                        guard let jsonData = try? JSONSerialization.data(withJSONObject: obj) else {
                            skipHandler?()
                            return
                        }
                        
                        central.sendData(data: jsonData)
                    }
                }
                Button("Cancel") {
                    skipHandler?()
                }
            } message: {
                Text("Enter channel name")
            }
        
        /*VStack(spacing: 20) {
            Text("BLE Central")
                .font(.title)
                .padding(.top, 50)

            Button(action: {
                central.sendMessage("hello")
            }) {
                Label("Send Message", systemImage: "paperplane.fill")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .cornerRadius(10)
            }
            .padding(.horizontal)
        }
        .padding()*/
    }
}

#Preview {
    ContentView()
}
