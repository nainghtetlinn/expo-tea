import Colors from "@/constants/Colors";
import Styles from "@/constants/Styles";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Device } from "react-native-ble-plx";
import { Text } from "react-native-paper";

export default function BluetoothStatus({
  connectedDevice,
  isConnecting,
}: {
  connectedDevice?: Device;
  isConnecting: boolean;
}) {
  const [badgeText, badgeBgColor, badgeDotColor] = isConnecting
    ? ["Connecting", Colors.warnLight, Colors.warn]
    : connectedDevice
      ? ["Connected", Colors.successLight, Colors.success]
      : ["Disconnected", Colors.errorLight, Colors.error];

  return (
    <View style={{ gap: 8, marginBottom: 16 }}>
      <View style={styles.statusContainer}>
        <Text variant="labelLarge">Connected Device: </Text>
        <Text
          variant="bodyMedium"
          style={{ minWidth: 60 }}
        >
          {connectedDevice?.name || "-"}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <Text variant="labelLarge">Bluetooth Status: </Text>
        <View
          style={[styles.badgeContainer, { backgroundColor: badgeBgColor }]}
        >
          <View style={[Styles.dot, { backgroundColor: badgeDotColor }]} />
          <Text variant="bodySmall">{badgeText}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
