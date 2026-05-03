import { type Device, State } from "react-native-ble-plx";
import { create } from "zustand";

type BluetoothStoreState = {
  bleState: State;
  isScanning: boolean;
  isConnecting: boolean;
  connectedDevice: Device | null;
  foundDevices: Device[];
  connectingDeviceId: string | null;

  setBleState: (state: State) => void;
  setScanning: (scanning: boolean) => void;
  setFoundDevices: (devices: Device[]) => void;
  setConnectedDevice: (device: Device | null) => void;
  setConnecting: (id: string | null) => void;
};

export const useBluetoothStore = create<BluetoothStoreState>((set) => ({
  bleState: State.PoweredOff,
  isScanning: false,
  isConnecting: false,
  connectedDevice: null,
  foundDevices: [],
  connectingDeviceId: null,

  setBleState: (bleState) => set({ bleState }),
  setScanning: (isScanning) => set({ isScanning }),
  setFoundDevices: (foundDevices) => set({ foundDevices }),
  setConnectedDevice: (connectedDevice) => set({ connectedDevice }),
  setConnecting: (id) => set({ connectingDeviceId: id, isConnecting: !!id }),
}));
