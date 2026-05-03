import { Buffer } from "buffer";
import { Linking, Platform } from "react-native";
import { BleManager, type Device, State } from "react-native-ble-plx";
import { useBluetoothStore } from "@/stores/bluetooth-store";
import { requestBLEPermissions } from "../permissions";

export const SERVICE_UUID = "3b0947a7-1654-4b40-8f26-8a21169e054b";
export const CHARACTERISTIC_UUID = "ede453c3-a6f3-42b4-9077-77dc68fd2f73";

export const bleManager = new BleManager();

const TTL_MS = 5000;
let scanInterval: number | null = null;

export const BluetoothService = {
  openSettings: () => {
    if (Platform.OS === "android") {
      Linking.sendIntent("android.settings.BLUETOOTH_SETTINGS");
    }
  },

  startScanning: async () => {
    const store = useBluetoothStore.getState();

    const hasPermission = await requestBLEPermissions();
    if (!hasPermission) return;

    if (store.bleState !== State.PoweredOn) return;

    if (store.isScanning) return;

    store.setScanning(true);

    const devicesMap = new Map<string, { device: Device; lastSeen: number }>();

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        return;
      }
      if (device?.name) {
        devicesMap.set(device.id, { device, lastSeen: Date.now() });
      }
    });

    scanInterval = setInterval(() => {
      const now = Date.now();

      for (const [id, data] of devicesMap.entries()) {
        if (now - data.lastSeen > TTL_MS) {
          devicesMap.delete(id);
        }
      }

      const freshDevices = Array.from(devicesMap.values()).map((d) => d.device);
      store.setFoundDevices(freshDevices);
    }, 2000);
  },

  stopScanning: () => {
    if (scanInterval) clearInterval(scanInterval);
    bleManager.stopDeviceScan();
    useBluetoothStore.getState().setScanning(false);
  },

  connect: async (device: Device) => {
    const store = useBluetoothStore.getState();

    store.setConnecting(device.id);

    try {
      const connected = await device.connect();
      await connected.requestMTU(255);
      await connected.discoverAllServicesAndCharacteristics();

      store.setConnectedDevice(connected);
      BluetoothService.stopScanning();
    } catch (error) {
      console.log(error);
    } finally {
      store.setConnecting(null);
    }
  },

  sendJson: async (data: object) => {
    const device = useBluetoothStore.getState().connectedDevice;
    if (!device) return;

    const payload = Buffer.from(JSON.stringify(data)).toString("base64");
    await device.writeCharacteristicWithResponseForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      payload,
    );
  },
};
