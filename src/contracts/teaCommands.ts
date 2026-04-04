import { TeaIngredients } from "@/types/tea";

export type TeaCommandType = "MAKE_TEA" | "GET_BUTTONS_INFO" | "SET_BUTTON";

export interface MakeTeaCommand {
  type: "MAKE_TEA";
  payload: TeaIngredients;
}

export interface GetButtonsInfo {
  type: "GET_BUTTONS_INFO";
}

export interface SetButtonCommand {
  type: "SET_BUTTON";
  payload: {
    buttonId: 1 | 2 | 3;
    recipe: TeaIngredients;
  };
}

export type TeaCommand = MakeTeaCommand | SetButtonCommand;

export const createMakeTeaCommand = (
  ingredients: TeaIngredients,
): MakeTeaCommand => ({
  type: "MAKE_TEA",
  payload: ingredients,
});

export const createGetButtonsInfoCommand = (): GetButtonsInfo => ({
  type: "GET_BUTTONS_INFO",
});

export const createSetButtonCommand = (
  buttonId: 1 | 2 | 3,
  recipe: TeaIngredients,
): SetButtonCommand => ({
  type: "SET_BUTTON",
  payload: {
    buttonId,
    recipe,
  },
});
