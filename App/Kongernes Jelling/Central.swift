//
//  Central.swift
//  Kongernes Jelling
//
//  Created by Sebastian on 25/10/2025.
//

import CoreBluetooth
import Foundation

class Central: NSObject, CBCentralManagerDelegate, CBPeripheralDelegate {
    private var centralManager: CBCentralManager!
    private var discoveredPeripheral: CBPeripheral?
    private let serviceUUID = CBUUID(string: "6E400001-B5A3-F393-E0A9-E50E24DCCA9E")
    private let writeCharacteristicUUID = CBUUID(string: "6E400002-B5A3-F393-E0A9-E50E24DCCA9E") // replace with yours
    private var writeCharacteristic: CBCharacteristic?

    override init() {
        super.init()
        centralManager = CBCentralManager(delegate: self, queue: nil)
    }

    // MARK: - CBCentralManagerDelegate

    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        switch central.state {
        case .poweredOn:
            print("Bluetooth is ON, scanning...")
            centralManager.scanForPeripherals(withServices: [serviceUUID], options: nil)
        default:
            print("Bluetooth not available (\(central.state.rawValue))")
        }
    }

    func centralManager(_ central: CBCentralManager,
                        didDiscover peripheral: CBPeripheral,
                        advertisementData: [String : Any],
                        rssi RSSI: NSNumber) {
        print("Found peripheral: \(peripheral.name ?? "Unknown")")
        discoveredPeripheral = peripheral
        discoveredPeripheral?.delegate = self
        centralManager.stopScan()
        centralManager.connect(peripheral, options: nil)
    }

    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        print("Connected to \(peripheral.name ?? "device")")
        peripheral.discoverServices([serviceUUID])
    }

    func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
        print("Disconnected")
        writeCharacteristic = nil
        centralManager.scanForPeripherals(withServices: [serviceUUID], options: nil)
    }

    // MARK: - CBPeripheralDelegate

    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        guard error == nil, let services = peripheral.services else { return }

        for service in services where service.uuid == serviceUUID {
            print("Service discovered")
            peripheral.discoverCharacteristics([writeCharacteristicUUID], for: service)
        }
    }

    func peripheral(_ peripheral: CBPeripheral,
                    didDiscoverCharacteristicsFor service: CBService,
                    error: Error?) {
        guard error == nil, let characteristics = service.characteristics else { return }

        for characteristic in characteristics where characteristic.uuid == writeCharacteristicUUID {
            writeCharacteristic = characteristic
            print("Ready to send messages")
        }
    }

    // MARK: - Write Data

    func sendMessage(_ text: String) {
        guard let peripheral = discoveredPeripheral,
              let characteristic = writeCharacteristic else {
            print("Not connected or characteristic unavailable")
            return
        }

        let data = text.data(using: .utf8)!
        peripheral.writeValue(data, for: characteristic, type: .withResponse)
        print("Sent: \(text)")
    }
    
    func sendData(data: Data) {
        guard let peripheral = discoveredPeripheral,
              let characteristic = writeCharacteristic else {
            print("Not connected or characteristic unavailable")
            return
        }
        peripheral.writeValue(data, for: characteristic, type: .withResponse)
        print("Sent: \(data)")
    }

    func peripheral(_ peripheral: CBPeripheral,
                    didWriteValueFor characteristic: CBCharacteristic,
                    error: Error?) {
        if let error = error {
            print("Write failed: \(error.localizedDescription)")
        } else {
            print("Message sent successfully")
        }
    }
}
