import type { TeaIngredients } from "@/types/tea";

export type DeviceNotificationType =
  | "TEA_START"
  | "TEA_PROGRESS"
  | "TEA_FINISH"
  | "ERROR"
  | "BUTTONS_INFO";

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

export interface ErrorNotification {
  type: "ERROR";
  payload: {
    code: string;
    message: string;
  };
}

export interface ButtonInfo extends TeaIngredients {
  name: string;
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
