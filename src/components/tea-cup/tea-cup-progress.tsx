import { useMemo } from "react";
import { useDeviceStore } from "@/stores/device-store";
import {
  computeLiquidHeights,
  type LiquidHeights,
  TeaCupSvg,
} from "./tea-cup-svg";

export function TeaCupProgress({ totalHeight = 60 }: { totalHeight?: number }) {
  const { targetIngredients, currentProgress } = useDeviceStore();

  const targetTotalMl = targetIngredients
    ? targetIngredients.tea +
      targetIngredients.condensedMilk +
      targetIngredients.evaporatedMilk +
      targetIngredients.milk
    : 0;

  const liquidHeights = useMemo(() => {
    if (!currentProgress || targetTotalMl === 0)
      return [0, 0, 0, 0] as LiquidHeights;
    const { tea, condensedMilk, evaporatedMilk, milk } = currentProgress;
    return computeLiquidHeights(
      [tea, condensedMilk, evaporatedMilk, milk],
      targetTotalMl,
    );
  }, [currentProgress, targetTotalMl]);

  return <TeaCupSvg liquidHeights={liquidHeights} totalHeight={totalHeight} />;
}
