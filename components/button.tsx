import Colors from "@/constants/Colors";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

export default function Button({
  children,
  style,
  ...props
}: TouchableOpacityProps & { children: string }) {
  return (
    <TouchableOpacity
      {...props}
      style={[styles.container, style]}
    >
      <Text>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    color: Colors.text,
    borderRadius: 1000,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
