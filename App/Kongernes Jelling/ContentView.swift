//
//  ContentView.swift
//  Kongernes Jelling
//
//  Created by Sebastian on 24/10/2025.
//

import SwiftUI
import WebKit

struct ContentView: View {
    private var central = Central()
    
    @State private var page: WebPage
    
    init() {
        var configuration = WebPage.Configuration()
                
        var navigationPreference = WebPage.NavigationPreferences()
        
        navigationPreference.allowsContentJavaScript = true
        navigationPreference.preferredHTTPSNavigationPolicy = .keepAsRequested
        navigationPreference.preferredContentMode = .mobile
        configuration.defaultNavigationPreferences = navigationPreference
        
        let page = WebPage(configuration: configuration)
        
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
            }
            .ignoresSafeArea()
        
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
