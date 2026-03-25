import { useBluetoothContext } from "@/utils/bluetooth-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const { connectedDevice } = useBluetoothContext();

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="tea" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="connect"
        options={{
          title: "Bluetooth",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name={
                connectedDevice ? "bluetooth-connected" : "bluetooth-disabled"
              }
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
