import { TeaCard } from "@/components/tea-card";
import { TeaStatus } from "@/components/tea-status";
import { recipes } from "@/constants/Recipes";
import { useTeaContext } from "@/lib/tea-context";
import { FlatList, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export function HomeScreen() {
  const { loading, customRecipes } = useTeaContext();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 gap-4">
      <TeaStatus />
      <FlatList
        data={[...customRecipes, ...recipes]}
        keyExtractor={(r) => r.id.toString()}
        contentContainerClassName="p-4 pt-1 gap-4"
        renderItem={({ item }) => <TeaCard tea={item} />}
      />
    </View>
  );
}
