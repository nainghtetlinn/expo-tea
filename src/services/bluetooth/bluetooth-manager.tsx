import { useEffect } from "react";
import { useBluetoothStore } from "@/stores/bluetooth-store";
import { useSnackbarStore } from "@/stores/snackbar-store";
import { bleManager } from "./ble";

export const BluetoothManager = () => {
  const { setBleState, setConnectedDevice, connectedDevice } =
    useBluetoothStore();
  const toast = useSnackbarStore((state) => state.toast);

  useEffect(() => {
    bleManager.state().then(setBleState);

    const subscription = bleManager.onStateChange((s) => {
      setBleState(s);
    }, true);

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!connectedDevice) return;

    const subscription = connectedDevice.onDisconnected(() => {
      setConnectedDevice(null);
      toast(`Disconnected from ${connectedDevice.name}`);
    });

    return () => subscription.remove();
  }, [connectedDevice]);

  return null;
};
