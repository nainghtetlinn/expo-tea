import {
  CHARACTERISTIC_UUID,
  manager,
  SERVICE_UUID,
} from "@/constants/Bluetooth";
import { Buffer } from "buffer";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import { Device, State } from "react-native-ble-plx";

type BluetoothContextType = {
  isScanning: boolean;
  isConnecting: boolean;
  connectingDeviceId: string | null;
  foundDevices: Device[];
  connectedDevice: Device | null;
  startScanning: () => void;
  stopScanning: () => void;
  connectToDevice: (device: Device) => void;
  sendJson: (name: string, data: object) => void;
};

const BluetoothContext = createContext<BluetoothContextType | null>(null);

const requestBLEPermissions = async () => {
  if (Platform.OS === "android") {
    try {
      if (Platform.Version >= 31) {
        // Android 12+
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const allGranted =
          granted["android.permission.BLUETOOTH_SCAN"] === "granted" &&
          granted["android.permission.BLUETOOTH_CONNECT"] === "granted" &&
          granted["android.permission.ACCESS_FINE_LOCATION"] === "granted";

        if (!allGranted) {
          Alert.alert(
            "Permission Required",
            "BLE permissions are required to scan and connect to devices.",
          );
        }

        return allGranted;
      } else {
        // Android < 12
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            "Permission Required",
            "Location permission is required to scan BLE devices.",
          );
        }

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  // iOS handles permissions automatically through infoPlist
  return true;
};

export function BluetoothContextProvider({ children }: PropsWithChildren) {
  const intervalRef = useRef<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [foundDevices, setFoundDevices] = useState<Device[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(
    null,
  );
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  const startScanning = async () => {
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

    if (isScanning) return;
    console.log("Scanning...");
    setIsScanning(true);

    let devices: Device[] = [];
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }
      if (device && device.name && !devices.find((d) => d.id === device.id)) {
        devices.push(device);
      }
    });

    intervalRef.current = setInterval(() => {
      setFoundDevices(devices);
      devices = [];
    }, 2000);
  };

  const stopScanning = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    manager.stopDeviceScan();
    setIsScanning(false);
    console.log("Stopped");
  };

  const connectToDevice = async (device: Device) => {
    if (isConnecting) return;
    console.log("Connecting...");
    setIsConnecting(true);
    setConnectingDeviceId(device.id);

    try {
      const connected = await device.connect();
      await connected.requestMTU(255);
      await connected.discoverAllServicesAndCharacteristics();

      connected.onDisconnected(() => {
        console.log("Disconnected:", connected.name);
        setConnectedDevice(null);
      });

      console.log("Connected:", connected.name);
      setConnectedDevice(device);

      stopScanning();
    } catch (error) {
      console.log("Connection error:", error);
    } finally {
      setIsConnecting(false);
      setConnectingDeviceId(null);
    }
  };

  const sendJson = async (name: string, data: object) => {
    if (!connectedDevice) return;

    const payload = JSON.stringify(data);
    const base64Data = Buffer.from(payload).toString("base64");

    try {
      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Data,
      );
      console.log(name);
    } catch (error) {
      console.log("Write error:", error);
    }
  };

  useEffect(() => {
    const subscription = manager.onStateChange(console.log);
    return () => subscription.remove();
  }, []);

  return (
    <BluetoothContext.Provider
      value={{
        isScanning,
        isConnecting,
        connectingDeviceId,
        foundDevices,
        connectedDevice,
        startScanning,
        stopScanning,
        connectToDevice,
        sendJson,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
}

export const useBluetoothContext = () => {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error(
      "useBluetoothContext must be used within BluetoothContextProvider",
    );
  }
  return context;
};
