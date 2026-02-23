import Colors from "@/constants/Colors";
import Styles from "@/constants/Styles";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Device } from "react-native-ble-plx";

export default function BluetoothStatus({ device }: { device?: Device }) {
  const color = device ? Colors.success : Colors.error;
  const bgColor = device ? Colors.successLight : Colors.errorLight;
  const text = device ? "Connected" : "Disconnected";

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text>Device: </Text>
        <Text style={styles.deviceName}>{device?.name || "-"}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text>Status: </Text>
        <View style={[styles.badgeContainer, { backgroundColor: bgColor }]}>
          <View style={[Styles.dot, { backgroundColor: color }]} />
          <Text style={styles.badgeText}>{text}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 1000,
  },
  deviceName: {
    minWidth: 80,
    textAlign: "center",
  },
  badgeText: {
    fontSize: 12,
  },
});
