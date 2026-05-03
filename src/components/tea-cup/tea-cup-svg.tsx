import { useMemo } from "react";
import { View } from "react-native";
import Svg, { ClipPath, Defs, Path, Rect } from "react-native-svg";
import { useThemeModeStore } from "@/stores/theme-mode-store";

const CUP_GEOMETRY = {
  viewBoxWidth: 515,
  viewBoxHeight: 353,
  liquidTopY: 45,
  liquidBottomY: 305,
} as const;

const OUTLINE_WIDTH = 20;

const CUP_BODY_PATH =
  "M35.6614 105.787C34.5336 95.0529 33.9699 89.6858 34.207 85.261C35.4511 62.0639 50.8255 42.8444 71.3872 38.7764C75.3097 38 80.1665 38 89.8801 38H328.534C338.247 38 343.105 38 347.028 38.7764C367.59 42.8444 382.965 62.0639 384.207 85.261C384.444 89.6858 383.882 95.0529 382.753 105.787L373.706 191.922C369.62 230.795 350.951 265.935 322.308 288.657C301.204 305.397 275.933 314.395 250.014 314.395H168.401C142.483 314.395 117.21 305.397 96.1063 288.657C67.4638 265.935 48.7939 230.795 44.7101 191.922L35.6614 105.787Z";

const CUP_HANDLE_PATH =
  "M367.292 213.887H412.459C449.877 213.887 480.209 180.14 480.209 138.507C480.209 96.8745 449.877 63.1267 412.459 63.1267H378.584";

// [tea, condensedMilk, evaporatedMilk, milk]
export type LiquidHeights = [number, number, number, number];

export function TeaCupSvg({
  totalHeight = 60,
  liquidHeights,
}: {
  totalHeight?: number;
  liquidHeights: LiquidHeights;
}) {
  const { isDark } = useThemeModeStore();

  const palette = useMemo(
    () => ({
      cupStroke: isDark ? "#E2E8F0" : "#1C274C",
      condensedMilk: "#F8E6B6",
      evaporatedMilk: "#FDFFF5",
      tea: "#E67338",
      milk: "#FDFFF5",
    }),
    [isDark],
  );

  const { viewBoxWidth, viewBoxHeight, liquidBottomY } = CUP_GEOMETRY;
  const [teaH, condensedH, evaporatedH, milkH] = liquidHeights;

  return (
    <View className="-my-3" style={{ height: totalHeight, width: totalHeight }}>
      <Svg
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        width="100%"
      >
        <Defs>
          <ClipPath id="cupClip">
            <Path
              d={CUP_BODY_PATH}
              fill="white"
              stroke="white"
              strokeLinejoin="round"
              strokeWidth={OUTLINE_WIDTH}
            />
          </ClipPath>
        </Defs>

        <Rect
          clipPath="url(#cupClip)"
          fill={palette.condensedMilk}
          height={condensedH}
          width={viewBoxWidth}
          x="0"
          y={liquidBottomY - condensedH}
        />

        <Rect
          clipPath="url(#cupClip)"
          fill={palette.evaporatedMilk}
          height={evaporatedH}
          width={viewBoxWidth}
          x="0"
          y={liquidBottomY - condensedH - evaporatedH}
        />

        <Rect
          clipPath="url(#cupClip)"
          fill={palette.tea}
          height={teaH}
          width={viewBoxWidth}
          x="0"
          y={liquidBottomY - condensedH - evaporatedH - teaH}
        />

        <Rect
          clipPath="url(#cupClip)"
          fill={palette.milk}
          height={milkH}
          width={viewBoxWidth}
          x="0"
          y={liquidBottomY - condensedH - evaporatedH - teaH - milkH}
        />

        <Path
          d={CUP_BODY_PATH}
          fill="none"
          stroke={palette.cupStroke}
          strokeWidth={OUTLINE_WIDTH}
        />
        <Path
          d={CUP_HANDLE_PATH}
          fill="none"
          stroke={palette.cupStroke}
          strokeWidth={OUTLINE_WIDTH}
        />
      </Svg>
    </View>
  );
}

// Helper used by both wrappers
export function computeLiquidHeights(
  amounts: [number, number, number, number],
  denominator: number,
): LiquidHeights {
  const liquidHeight = CUP_GEOMETRY.liquidBottomY - CUP_GEOMETRY.liquidTopY;
  if (denominator === 0) return [0, 0, 0, 0];
  return amounts.map((v) => (v / denominator) * liquidHeight) as LiquidHeights;
}
