import { CHARACTERISTIC_UUID, SERVICE_UUID } from "@/constants/Bluetooth";
import { requestBLEPermissions } from "@/utils/permissions";
import { Buffer } from "buffer";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Linking, Platform } from "react-native";
import { BleManager, Device, State } from "react-native-ble-plx";
import { Button, Dialog, Portal, Text } from "react-native-paper";

type BluetoothContextType = {
  manager: BleManager | null;
  bleState: State;
  isScanning: boolean;
  isConnecting: boolean;
  connectingDeviceId: string | null;
  foundDevices: Device[];
  connectedDevice: Device | null;
  startScanning: () => void;
  stopScanning: () => void;
  connectToDevice: (device: Device) => void;
  sendJson: (data: object) => void;
};

const BluetoothContext = createContext<BluetoothContextType | null>(null);

export function BluetoothContextProvider({ children }: PropsWithChildren) {
  const intervalRef = useRef<number | null>(null);
  const [manager, setManager] = useState<BleManager | null>(null);
  const [bleState, setBleState] = useState<State>(State.PoweredOff);
  const [showAlert, setShowAlert] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [foundDevices, setFoundDevices] = useState<Device[]>([]);
  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(
    null,
  );

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleOpenSettings = () => {
    setShowAlert(false);
    if (Platform.OS === "android") {
      Linking.sendIntent("android.settings.BLUETOOTH_SETTINGS");
    }
  };

  const startScanning = async () => {
    if (!manager) return;

    const hasPermission = await requestBLEPermissions();
    if (!hasPermission) return;

    if (bleState != State.PoweredOn) return setShowAlert(true);

    if (isScanning) return;
    setIsScanning(true);
    console.log("Scanning...");

    let devices: Device[] = [];
    manager?.startDeviceScan(null, null, (error, device) => {
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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      manager?.stopDeviceScan();
      setIsScanning(false);
      console.log("Stopped");
    }
  };

  const connectToDevice = async (device: Device) => {
    if (isConnecting) return;
    setIsConnecting(true);
    setConnectingDeviceId(device.id);
    console.log("Connecting...");

    try {
      const connected = await device.connect();
      await connected.requestMTU(255);
      await connected.discoverAllServicesAndCharacteristics();

      setConnectedDevice(device);
      console.log("Connected:", connected.name);

      stopScanning();
    } catch (error) {
      console.log("Connection error:", error);
    } finally {
      setIsConnecting(false);
      setConnectingDeviceId(null);
    }
  };

  const sendJson = async (data: object) => {
    if (!connectedDevice) return;

    const payload = JSON.stringify(data);
    const base64Data = Buffer.from(payload).toString("base64");

    try {
      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Data,
      );
    } catch (error) {
      console.log("Write error:", error);
    }
  };

  useEffect(() => {
    if (!connectedDevice) return;
    const subscription = connectedDevice.onDisconnected(() => {
      setConnectedDevice(null);
      console.log("Disconnected:", connectedDevice.name);
    });
    return () => subscription.remove();
  }, [connectedDevice]);

  useEffect(() => {
    if (!manager) {
      setManager(new BleManager());
      return;
    }
    const init = async () => {
      const s = await manager.state();
      setBleState(s);
    };
    init();
    const subscription = manager.onStateChange((s) => {
      setBleState(s);
      console.log(s);
    });
    return () => subscription.remove();
  }, [manager]);

  return (
    <BluetoothContext.Provider
      value={{
        manager,
        bleState,
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
      <Portal>
        <Dialog visible={showAlert} onDismiss={handleCloseAlert}>
          <Dialog.Title>Bluetooth is not enabled</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Please enable Bluetooth to connect to the device.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCloseAlert}>Cancel</Button>
            <Button onPress={handleOpenSettings}>Open Settings</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
