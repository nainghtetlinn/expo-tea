import type { TeaIngredients } from "./tea";

export interface ButtonInfo extends TeaIngredients {
  name: string;
}

export interface DeviceInfo {
  temperature: number;
  weight: number;
  calibrationFactor: number;
  cupWeight: number;
  weightMode: boolean;
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

export interface SetDispensingModeCommand {
  type: "SET_DISPENSING_MODE";
  payload: {
    weightMode: boolean;
  };
}

export interface GetDeviceInfoCommand {
  type: "GET_DEVICE_INFO";
  payload?: never;
}

export type DeviceCommand =
  | MakeTeaCommand
  | GetButtonsInfoCommand
  | SetButtonInfoCommand
  | SetDispensingModeCommand
  | GetDeviceInfoCommand;

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
  payload: TeaIngredients & {
    percentage: number;
  };
}

export interface TeaFinishNotification {
  type: "TEA_FINISH";
  payload?: never;
}

export interface CupRemovedNotification {
  type: "CUP_REMOVED";
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

export interface DeviceInfoNotification {
  type: "DEVICE_INFO";
  payload: DeviceInfo;
}

export interface DispensingModeNotification {
  type: "DISPENSING_MODE";
  payload: {
    weightMode: boolean;
  };
}

export type DeviceNotification =
  | TeaStartNotification
  | TeaProgressNotification
  | TeaFinishNotification
  | CupRemovedNotification
  | ErrorNotification
  | ButtonsInfoNotification
  | DeviceInfoNotification
  | DispensingModeNotification;
