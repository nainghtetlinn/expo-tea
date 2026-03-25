import { Tea } from "@/types/tea";
import React from "react";
import { FlatList, View } from "react-native";
import TeaCard from "./tea-card";

export default function TeaList({ teas }: { teas: Tea[] }) {
  return (
    <FlatList
      data={teas}
      keyExtractor={(r) => r.id.toString()}
      ItemSeparatorComponent={() => <View style={{ marginVertical: 6 }} />}
      renderItem={({ item }) => <TeaCard tea={item} />}
      contentContainerClassName="p-4"
    />
  );
}
