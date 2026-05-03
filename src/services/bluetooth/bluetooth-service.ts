import { Buffer } from "buffer";
import { Linking, Platform } from "react-native";
import { type Device, State } from "react-native-ble-plx";
import { useBluetoothStore } from "@/stores/bluetooth-store";
import { useSnackbarStore } from "@/stores/snackbar-store";
import type { DeviceCommand } from "@/types/device";
import { requestBLEPermissions } from "../permissions";
import { bleManager, CHARACTERISTIC_UUID, SERVICE_UUID } from "./ble";

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
    const snackbar = useSnackbarStore.getState();

    store.setConnecting(device.id);

    try {
      const connected = await device.connect();
      await connected.requestMTU(255);
      await connected.discoverAllServicesAndCharacteristics();

      store.setConnectedDevice(connected);
      BluetoothService.stopScanning();
      snackbar.toast(`Connected to ${connected.name}`);
    } catch (error) {
      console.log(error);
    } finally {
      store.setConnecting(null);
    }
  },

  sendJson: async (data: DeviceCommand) => {
    const device = useBluetoothStore.getState().connectedDevice;
    if (!device) return;

    console.log(`[SEND] type: ${data.type}, payload:`, data.payload);

    const payload = Buffer.from(JSON.stringify(data)).toString("base64");
    await device.writeCharacteristicWithResponseForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      payload,
    );
  },
};
