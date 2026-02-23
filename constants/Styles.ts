import { StyleSheet } from "react-native";
import Colors from "./Colors";

export default StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.text,
  },
  paragraph: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  dot: {
    borderRadius: "100%",
    width: 12,
    height: 12,
  },
});
