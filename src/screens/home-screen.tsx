import { TeaCard } from "@/components/tea-card";
import { recipes } from "@/constants/Recipes";
import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";

export function HomeScreen() {
  return (
    <View className="flex-1 gap-2">
      <View className="items-center">
        <Text variant="titleLarge">Tea Mixer</Text>
      </View>
      <FlatList
        data={recipes}
        keyExtractor={(r) => r.id.toString()}
        contentContainerClassName="p-4 gap-4"
        renderItem={({ item }) => <TeaCard tea={item} />}
      />
    </View>
  );
}
