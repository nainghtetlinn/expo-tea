import BluetoothStatus from "@/components/bluetooth-status";
import Button from "@/components/button";
import DevicesList from "@/components/devices-list";
import { manager } from "@/constants/Bluetooth";
import Styles from "@/constants/Styles";
import { requestBLEPermissions } from "@/utils/permission";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Device, State } from "react-native-ble-plx";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConnectScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device>();

  const startScan = async () => {
    const hasPermission = await requestBLEPermissions();
    if (!hasPermission) return;

    const state = await manager.state();

    if (state !== State.PoweredOn) {
      Alert.alert(
        "Bluetooth is not enabled",
        "Please enable Bluetooth to connect to the device.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => {
              if (Platform.OS === "android") {
                Linking.sendIntent("android.settings.BLUETOOTH_SETTINGS");
              }
            },
          },
        ],
      );
      return;
    }

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
      setIsConnecting(true);
      manager.stopDeviceScan();

      const connected = await device.connect();
      await connected.discoverAllServicesAndCharacteristics();

      connected.onDisconnected(() => {
        setConnectedDevice(undefined);
      });

      setConnectedDevice(connected);
      setDevices([]);

      console.log("Connected to", connected.name);
    } catch (error) {
      console.log("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectDevice = async () => {
    if (!connectedDevice) return;
    try {
      await connectedDevice.cancelConnection();
      setConnectedDevice(undefined);
      console.log("Disconnected successfully");
    } catch (error) {
      console.log("Disconnect error:", error);
    }
  };

  useEffect(() => {
    const subscription = manager.onStateChange(console.log);
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[Styles.heading, styles.header]}>Tea Mixer</Text>

      <BluetoothStatus device={connectedDevice} />

      {connectedDevice ? (
        <Button
          onPress={disconnectDevice}
          style={[styles.button]}
        >
          Disconnect
        </Button>
      ) : (
        <Button
          onPress={startScan}
          disabled={isScanning}
          style={[styles.button, isScanning && { opacity: 0.5 }]}
        >
          Scan Device
        </Button>
      )}

      {!connectedDevice && (
        <View>
          {isScanning ? (
            <ActivityIndicator />
          ) : (
            <DevicesList
              devices={devices}
              connectToDevice={connectToDevice}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  button: {
    marginTop: 12,
    marginBottom: 20,
  },
});
