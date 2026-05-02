import type { TeaIngredients } from "@/types/tea";

import type { ButtonInfo } from "./deviceNotifications";

export interface MakeTeaCommand {
  type: "MAKE_TEA";
  payload: TeaIngredients;
}

export interface GetButtonsInfo {
  type: "GET_BUTTONS_INFO";
}

export interface SetButtonCommand {
  type: "SET_BUTTON_INFO";
  payload: ButtonInfo & {
    id: 0 | 1 | 2;
  };
}

export const createMakeTeaCommand = (
  ingredients: TeaIngredients,
): MakeTeaCommand => ({
  type: "MAKE_TEA",
  payload: ingredients,
});

export const createGetButtonsInfoCommand = (): GetButtonsInfo => ({
  type: "GET_BUTTONS_INFO",
});

export const createSetButtonInfoCommand = (
  id: 0 | 1 | 2,
  recipe: ButtonInfo,
): SetButtonCommand => ({
  type: "SET_BUTTON_INFO",
  payload: {
    id,
    ...recipe,
  },
});
