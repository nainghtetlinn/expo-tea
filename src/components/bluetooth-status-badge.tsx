import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { View } from "react-native";
import { Text } from "react-native-paper";

const statusBadgeVariants = cva(
  "flex-row items-center gap-2 rounded-full px-2 py-1",
  {
    variants: {
      variant: {
        error: "bg-error",
        success: "bg-success",
        warning: "bg-warning",
      },
    },
    defaultVariants: {
      variant: "error",
    },
  },
);
const statusBadgeDotVariants = cva("h-3 w-3 rounded-full", {
  variants: {
    variant: {
      error: "bg-error-foreground",
      success: "bg-success-foreground",
      warning: "bg-warning-foreground",
    },
  },
  defaultVariants: {
    variant: "error",
  },
});

export type StatusBadgeProps = VariantProps<typeof statusBadgeVariants>;

export function BluetoothStatusBadge({ variant }: StatusBadgeProps) {
  return (
    <View className={cn(statusBadgeVariants({ variant }))}>
      <View className={cn(statusBadgeDotVariants({ variant }))} />
      <Text variant="labelSmall" style={{ color: "black" }}>
        {variant === "error"
          ? "Disconnected"
          : variant === "success"
            ? "Connected"
            : "Connecting"}
      </Text>
    </View>
  );
}
