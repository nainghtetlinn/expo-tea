import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BleManager, Device, State } from "react-native-ble-plx";

import { requestBLEPermissions } from "@/utils/permission";
import { SafeAreaView } from "react-native-safe-area-context";

const manager = new BleManager();

const SERVICE_UUID = "3b0947a7-1654-4b40-8f26-8a21169e054b";
const CHARACTERISTIC_UUID = "ede453c3-a6f3-42b4-9077-77dc68fd2f73";

export default function HomeTabScreen() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device>();
  const [isScanning, setIsScanning] = useState(false);
  const [bleState, setBleState] = useState<State>(State.PoweredOff);

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      setBleState(state);
    });
    return () => {
      subscription.remove();
      manager.destroy();
    };
  }, []);

  const startScan = async () => {
    const hasPermission = await requestBLEPermissions();
    if (!hasPermission) return;

    setDevices([]);
    setIsScanning(true);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      if (device && device.name) {
        setDevices((prev) => {
          if (!prev.find((d) => d.id === device.id)) {
            return [...prev, device];
          }
          return prev;
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 5000);
  };

  const connectToDevice = async (device: Device) => {
    try {
      manager.stopDeviceScan();

      const connected = await device.connect();
      await connected.discoverAllServicesAndCharacteristics();

      connected.onDisconnected(() => {
        setConnectedDevice(undefined);
      });

      setConnectedDevice(connected);

      console.log("Connected to", connected.name);
    } catch (error) {
      console.log("Connection error:", error);
    }
  };

  const sendJson = async () => {
    if (!connectedDevice) return;

    const payload = JSON.stringify({
      tea: 40,
      milk: 20,
      condensed: 5,
      evaporated: 10,
    });

    const base64Data = Buffer.from(payload).toString("base64");

    try {
      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Data,
      );

      console.log("Sent JSON");
    } catch (error) {
      console.log("Write error:", error);
    }
  };

  const renderItem = ({ item }: { item: Device }) => {
    const isConnected = connectedDevice?.id === item.id;

    return (
      <TouchableOpacity
        style={styles.deviceItem}
        onPress={() => connectToDevice(item)}
      >
        <View style={styles.deviceInfo}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isConnected ? "green" : "red" },
            ]}
          />
          <Text style={styles.deviceName}>{item.name || "Unnamed Device"}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tea Mixer BLE</Text>

      <Button
        title={isScanning ? "Scanning..." : "Scan Devices"}
        onPress={startScan}
        disabled={isScanning}
      />

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ marginTop: 20 }}
      />

      {connectedDevice && (
        <View style={{ marginTop: 20 }}>
          <Button
            title="Send Mix Command"
            onPress={sendJson}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  deviceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceName: {
    fontSize: 16,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
});
