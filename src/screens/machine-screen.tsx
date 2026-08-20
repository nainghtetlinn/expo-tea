import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  SegmentedButtons,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { MachineTeaCard } from "@/components/tea-card";
import { DeviceService } from "@/services/device";
import { useDeviceStore } from "@/stores/device-store";

export function MachineScreen() {
  const { buttonInfos, deviceInfo } = useDeviceStore();
  const theme = useTheme();

  useEffect(() => {
    DeviceService.send.getButtonsInfo();
    DeviceService.send.getDeviceInfo();

    const interval = setInterval(() => {
      DeviceService.send.getDeviceInfo();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!buttonInfos)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );

  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-4 p-4">
      {/* Device Info */}
      {deviceInfo ? (
        <Surface
          mode="flat"
          style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
        >
          <View className="flex-row items-center justify-between p-4">
            <Text variant="titleMedium">Temperature</Text>
            <Text variant="bodyMedium">
              {deviceInfo.temperature.toFixed(1)} °C
            </Text>
          </View>
          <View className="flex-row items-center justify-between px-4 pb-4">
            <Text variant="titleMedium">Weight</Text>
            <Text variant="bodyMedium">{deviceInfo.weight.toFixed(1)} g</Text>
          </View>
          <View className="flex-row items-center justify-between px-4 pb-4">
            <Text variant="titleMedium">Calibration Factor</Text>
            <Text variant="bodyMedium">
              {deviceInfo.calibrationFactor.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row items-center justify-between px-4 pb-4">
            <Text variant="titleMedium">Cup Weight</Text>
            <Text variant="bodyMedium">
              {deviceInfo.cupWeight.toFixed(1)} g
            </Text>
          </View>
        </Surface>
      ) : (
        <Surface
          mode="flat"
          style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
        >
          <View className="items-center p-4">
            <ActivityIndicator size="small" />
          </View>
        </Surface>
      )}

      <Surface
        mode="flat"
        style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
      >
        <View className="flex flex-col gap-4 p-4">
          <Text variant="titleMedium">Dispensing Mode</Text>
          <SegmentedButtons
            buttons={[
              { value: "time", label: "Time", icon: "timer-outline" },
              { value: "weight", label: "Weight", icon: "scale-balance" },
            ]}
            onValueChange={(value) =>
              DeviceService.send.setDispensingMode(value === "weight")
            }
            value={deviceInfo?.weightMode ? "weight" : "time"}
          />
        </View>
      </Surface>

      {/* Machine Button Cards */}
      <MachineTeaCard btnIndex={0} info={buttonInfos.btn0} />
      <MachineTeaCard btnIndex={1} info={buttonInfos.btn1} />
      <MachineTeaCard btnIndex={2} info={buttonInfos.btn2} />
    </ScrollView>
  );
}
