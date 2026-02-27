import MachineStatus from "@/components/machine-status";
import TeaCard from "@/components/tea-card";
import { recipes } from "@/constants/Recipes";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text
        variant="headlineSmall"
        style={styles.header}
      >
        Tea Mixer
      </Text>

      <MachineStatus />

      <FlatList
        data={recipes}
        keyExtractor={(r) => r.id.toString()}
        ItemSeparatorComponent={() => <View style={{ marginVertical: 6 }} />}
        renderItem={({ item }) => <TeaCard tea={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 24,
    fontWeight: "bold",
  },
});
