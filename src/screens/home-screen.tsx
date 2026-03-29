import { TeaCard } from "@/components/tea-card";
import { recipes } from "@/constants/Recipes";
import { useTeaContext } from "@/lib/tea-context";
import { FlatList, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

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
    <View className="flex-1 gap-2">
      <View className="items-center">
        <Text variant="titleLarge">Tea Mixer</Text>
      </View>
      <FlatList
        data={[...customRecipes, ...recipes]}
        keyExtractor={(r) => r.id.toString()}
        contentContainerClassName="p-4 gap-4"
        renderItem={({ item }) => <TeaCard tea={item} />}
      />
    </View>
  );
}
