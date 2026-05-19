import { useState } from "react";
import { View } from "react-native";
import { State } from "react-native-ble-plx";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { BluetoothStatus } from "@/components/bluetooth-status";
import { DevicesList } from "@/components/devices-list";
import OpenSettingDialog from "@/components/dialogs/open-setting-dialog";
import { BluetoothService } from "@/services/bluetooth";
import { useBluetoothStore } from "@/stores/bluetooth-store";

export function BluetoothScreen() {
  const { bleState, isScanning, connectedDevice } = useBluetoothStore();
  const [showSetting, setShowSetting] = useState(false);

  const handleScanning = () => {
    if (bleState === State.PoweredOff) return setShowSetting(true);
    BluetoothService.startScanning();
    setTimeout(BluetoothService.stopScanning, 15000);
  };

  return (
    <>
      <OpenSettingDialog
        onClose={() => setShowSetting(false)}
        visible={showSetting}
      />

      <View className="flex-1 gap-4 p-4">
        <BluetoothStatus />

        <View className="flex-row items-center justify-between">
          <Text style={{ paddingVertical: 8 }} variant="bodyLarge">
            Available Devices
          </Text>
          {isScanning ? (
            <ActivityIndicator />
          ) : (
            <Button compact onPress={handleScanning}>
              Refresh
            </Button>
          )}
        </View>

        {!connectedDevice && <DevicesList />}
      </View>
    </>
  );
}
