import { useTeaContext } from "@/utils/tea-context";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function MachineStatus() {
  const { receivedData } = useTeaContext();

  return (
    <View>
      <Text>{receivedData.tea}</Text>
      <Text>{receivedData.condensedMilk}</Text>
      <Text>{receivedData.evaporatedMilk}</Text>
      <Text>{receivedData.milk}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
