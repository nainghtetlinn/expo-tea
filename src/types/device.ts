import type { TeaIngredients } from "./tea";

export interface ButtonInfo extends TeaIngredients {
  name: string;
}

/****************************************/

export interface MakeTeaCommand {
  type: "MAKE_TEA";
  payload: TeaIngredients;
}

export interface GetButtonsInfoCommand {
  type: "GET_BUTTONS_INFO";
  payload?: never;
}

export interface SetButtonInfoCommand {
  type: "SET_BUTTON_INFO";
  payload: { id: 0 | 1 | 2 } & ButtonInfo;
}

export type DeviceCommand =
  | MakeTeaCommand
  | GetButtonsInfoCommand
  | SetButtonInfoCommand;

/****************************************/

export interface ErrorNotification {
  type: "ERROR";
  payload: {
    code: string;
    message: string;
  };
}

export interface TeaStartNotification {
  type: "TEA_START";
  payload: TeaIngredients;
}

export interface TeaProgressNotification {
  type: "TEA_PROGRESS";
  payload: TeaIngredients;
}

export interface TeaFinishNotification {
  type: "TEA_FINISH";
  payload?: never;
}

export interface ButtonsInfoNotification {
  type: "BUTTONS_INFO";
  payload: {
    btn0: ButtonInfo;
    btn1: ButtonInfo;
    btn2: ButtonInfo;
  };
}

export type DeviceNotification =
  | TeaStartNotification
  | TeaProgressNotification
  | TeaFinishNotification
  | ErrorNotification
  | ButtonsInfoNotification;
