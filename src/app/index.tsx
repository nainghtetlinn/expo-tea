import { StatusBadge } from "@/components/bluetooth/status-badge";
import { View } from "react-native";

export default function Page() {
  return (
    <View className="flex-1 flex-row flex-wrap">
      <StatusBadge variant={"error"} />
      <StatusBadge variant={"success"} />
      <StatusBadge variant={"warning"} />
    </View>
  );
}
