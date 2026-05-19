import { useEffect } from "react";
import { useBluetoothStore } from "@/stores/bluetooth-store";
import { CHARACTERISTIC_UUID, SERVICE_UUID } from "../bluetooth";
import { DeviceService } from "./device-service";

export const DeviceManager = () => {
  const connectedDevice = useBluetoothStore((state) => state.connectedDevice);

  useEffect(() => {
    if (!connectedDevice) return;

    const subscription = connectedDevice.monitorCharacteristicForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      (error, char) => {
        if (error) {
          console.log("Monitor Error:", error);
          return;
        }
        if (char?.value) {
          DeviceService.handleNotification(char.value);
        }
      },
    );

    DeviceService.send.getButtonsInfo();

    return () => subscription.remove();
  }, [connectedDevice]);

  return null;
};
