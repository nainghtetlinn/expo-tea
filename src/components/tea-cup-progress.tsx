import { useTeaDeviceContext } from "@/lib/tea-device-context";
import { useThemeContext } from "@/lib/theme-context";
import { useMemo } from "react";
import { View } from "react-native";
import Svg, { ClipPath, Defs, Path, Rect } from "react-native-svg";

export function TeaCupProgress({ totalHeight = 60 }: { totalHeight?: number }) {
  const { isDark } = useThemeContext();
  const { targetIngredients, currentProgress } = useTeaDeviceContext();

  const targetTotalMl = targetIngredients
    ? targetIngredients.tea +
      targetIngredients.condensedMilk +
      targetIngredients.evaporatedMilk +
      targetIngredients.milk
    : 0;

  const cupGeometry = useMemo(() => {
    const viewBoxWidth = 515;
    const viewBoxHeight = 353;
    const liquidTopY = 45;
    const liquidBottomY = 305;

    return {
      viewBoxWidth,
      viewBoxHeight,
      liquidTopY,
      liquidBottomY,
    };
  }, []);

  const liquidHeights = useMemo(() => {
    const liquidHeight = cupGeometry.liquidBottomY - cupGeometry.liquidTopY;

    if (targetTotalMl === 0 || !currentProgress) return [0, 0, 0, 0];

    return [
      (currentProgress.tea / targetTotalMl) * liquidHeight,
      (currentProgress.condensedMilk / targetTotalMl) * liquidHeight,
      (currentProgress.evaporatedMilk / targetTotalMl) * liquidHeight,
      (currentProgress.milk / targetTotalMl) * liquidHeight,
    ];
  }, [cupGeometry, currentProgress, targetTotalMl]);

  const outlineWidth = 20;
  const cupBodyPath =
    "M35.6614 105.787C34.5336 95.0529 33.9699 89.6858 34.207 85.261C35.4511 62.0639 50.8255 42.8444 71.3872 38.7764C75.3097 38 80.1665 38 89.8801 38H328.534C338.247 38 343.105 38 347.028 38.7764C367.59 42.8444 382.965 62.0639 384.207 85.261C384.444 89.6858 383.882 95.0529 382.753 105.787L373.706 191.922C369.62 230.795 350.951 265.935 322.308 288.657C301.204 305.397 275.933 314.395 250.014 314.395H168.401C142.483 314.395 117.21 305.397 96.1063 288.657C67.4638 265.935 48.7939 230.795 44.7101 191.922L35.6614 105.787Z";
  const cupHandlePath =
    "M367.292 213.887H412.459C449.877 213.887 480.209 180.14 480.209 138.507C480.209 96.8745 449.877 63.1267 412.459 63.1267H378.584";

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

  return (
    <View className="-my-3" style={{ height: totalHeight, width: totalHeight }}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${cupGeometry.viewBoxWidth} ${cupGeometry.viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          <ClipPath id="cupClip">
            <Path
              d={cupBodyPath}
              fill="white"
              stroke="white"
              strokeWidth={outlineWidth}
              strokeLinejoin="round"
            />
          </ClipPath>
        </Defs>

        <Rect
          x="0"
          y={cupGeometry.liquidBottomY - liquidHeights[1]}
          width={cupGeometry.viewBoxWidth}
          height={liquidHeights[1]}
          fill={palette.condensedMilk}
          clipPath="url(#cupClip)"
        />
        <Rect
          x="0"
          y={cupGeometry.liquidBottomY - liquidHeights[1] - liquidHeights[2]}
          width={cupGeometry.viewBoxWidth}
          height={liquidHeights[2]}
          fill={palette.evaporatedMilk}
          clipPath="url(#cupClip)"
        />
        <Rect
          x="0"
          y={
            cupGeometry.liquidBottomY -
            liquidHeights[1] -
            liquidHeights[2] -
            liquidHeights[0]
          }
          width={cupGeometry.viewBoxWidth}
          height={liquidHeights[0]}
          fill={palette.tea}
          clipPath="url(#cupClip)"
        />
        <Rect
          x="0"
          y={
            cupGeometry.liquidBottomY -
            liquidHeights[1] -
            liquidHeights[2] -
            liquidHeights[0] -
            liquidHeights[3]
          }
          width={cupGeometry.viewBoxWidth}
          height={liquidHeights[3]}
          fill={palette.milk}
          clipPath="url(#cupClip)"
        />

        <Path
          d={cupBodyPath}
          fill="none"
          stroke={palette.cupStroke}
          strokeWidth={outlineWidth}
        />
        <Path
          d={cupHandlePath}
          fill="none"
          stroke={palette.cupStroke}
          strokeWidth={outlineWidth}
        />
      </Svg>
    </View>
  );
}
