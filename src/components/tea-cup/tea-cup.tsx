import { TeaIngredients } from "@/types/tea";
import { useMemo } from "react";
import { TeaCupSvg, computeLiquidHeights } from "./tea-cup-svg";

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

  return <TeaCupSvg totalHeight={totalHeight} liquidHeights={liquidHeights} />;
}
