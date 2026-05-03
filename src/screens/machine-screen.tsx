import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { MachineTeaCard } from "@/components/tea-card";
import { DeviceService } from "@/services/device";
import { useDeviceStore } from "@/stores/device-store";

export function MachineScreen() {
  const { buttonInfos } = useDeviceStore();

  useEffect(() => {
    DeviceService.send.getButtonsInfo();
  }, []);

  if (!buttonInfos)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );

  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-4 p-4">
      <MachineTeaCard btnIndex={0} info={buttonInfos.btn0} />
      <MachineTeaCard btnIndex={1} info={buttonInfos.btn1} />
      <MachineTeaCard btnIndex={2} info={buttonInfos.btn2} />
    </ScrollView>
  );
}
