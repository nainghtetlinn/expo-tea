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
  targetTotalMl: number;
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

export interface GetDeviceInfoCommand {
  type: "GET_DEVICE_INFO";
  payload?: never;
}

export interface GetTemperatureCommand {
  type: "GET_TEMPERATURE";
  payload?: never;
}

export interface GetWeightCommand {
  type: "GET_WEIGHT";
  payload?: never;
}

export interface SetDispensingModeCommand {
  type: "SET_DISPENSING_MODE";
  payload: {
    weightMode: boolean;
  };
}

export interface SetTargetTotalMlCommand {
  type: "SET_TARGET_TOTAL_ML";
  payload: {
    targetTotalMl: number;
  };
}

export interface CancelCleaningCommand {
  type: "CANCEL_CLEANING";
  payload?: never;
}

export type DeviceCommand =
  | MakeTeaCommand
  | GetButtonsInfoCommand
  | SetButtonInfoCommand
  | GetDeviceInfoCommand
  | GetTemperatureCommand
  | GetWeightCommand
  | SetDispensingModeCommand
  | SetTargetTotalMlCommand
  | CancelCleaningCommand;

/****************************************/

export interface ErrorNotification {
  type: "ERROR";
  payload: {
    code: string;
    message: string;
  };
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

export type TemperatureNotification = {
  type: "TEMPERATURE";
  payload: { temperature: number };
};

export type WeightNotification = {
  type: "WEIGHT";
  payload: { weight: number };
};

export interface DispensingModeNotification {
  type: "DISPENSING_MODE";
  payload: {
    weightMode: boolean;
  };
}

export interface TargetTotalMlNotification {
  type: "TARGET_TOTAL_ML";
  payload: {
    targetTotalMl: number;
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

// cup removed during dispensing
export interface CupWarningNotification {
  type: "CUP_WARNING";
  payload?: never;
}

export interface CleaningStartNotification {
  type: "CLEANING_START";
  payload: {
    durationSeconds: number;
  };
}

export interface CleaningProgressNotification {
  type: "CLEANING_PROGRESS";
  payload: {
    remainingSeconds: number;
    progress: number;
  };
}

export interface CleaningFinishedNotification {
  type: "CLEANING_FINISHED";
  payload?: never;
}

export interface CleaningCancelledNotification {
  type: "CLEANING_CANCELLED";
  payload?: never;
}

export type DeviceNotification =
  | ErrorNotification
  | ButtonsInfoNotification
  | DeviceInfoNotification
  | TemperatureNotification
  | WeightNotification
  | DispensingModeNotification
  | TargetTotalMlNotification
  | TeaStartNotification
  | TeaProgressNotification
  | TeaFinishNotification
  | CupRemovedNotification
  | CupWarningNotification
  | CleaningStartNotification
  | CleaningProgressNotification
  | CleaningFinishedNotification
  | CleaningCancelledNotification;
