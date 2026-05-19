import { useMemo } from "react";
import type { TeaIngredients } from "@/types/tea";
import { computeLiquidHeights, TeaCupSvg } from "./tea-cup-svg";

export function TeaCup({
  totalHeight = 60,
  ingredients,
}: {
  totalHeight?: number;
  ingredients: TeaIngredients;
}) {
  const { tea, condensedMilk, evaporatedMilk, milk } = ingredients;
  const totalMl = tea + condensedMilk + evaporatedMilk + milk;

  const liquidHeights = useMemo(
    () =>
      computeLiquidHeights([tea, condensedMilk, evaporatedMilk, milk], totalMl),
    [tea, condensedMilk, evaporatedMilk, milk, totalMl],
  );

  return <TeaCupSvg liquidHeights={liquidHeights} totalHeight={totalHeight} />;
}
