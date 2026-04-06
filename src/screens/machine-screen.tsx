import { MachineTeaCard } from "@/components/machine-tea-card";
import { useTeaDeviceContext } from "@/lib/tea-device-context";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export function MachineScreen() {
  const { buttonRecipes, getButtonsInfo } = useTeaDeviceContext();

  useEffect(() => {
    getButtonsInfo();
  }, []);

  if (!buttonRecipes)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );

  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-4 p-4">
      <MachineTeaCard btnIndex={0} info={buttonRecipes.btn0} />
      <MachineTeaCard btnIndex={1} info={buttonRecipes.btn1} />
      <MachineTeaCard btnIndex={2} info={buttonRecipes.btn2} />
    </ScrollView>
  );
}
