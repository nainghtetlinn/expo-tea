import { useEffect } from "react";
import { useBluetoothStore } from "@/stores/bluetooth-store";
import { bleManager } from "./ble";

export const BluetoothManager = () => {
  const { setBleState, setConnectedDevice, connectedDevice } =
    useBluetoothStore();

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
    });

    return () => subscription.remove();
  }, [connectedDevice]);

  return null;
};
