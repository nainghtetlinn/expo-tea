import { Buffer } from "buffer";
import { useDeviceStore } from "@/stores/device-store";
import { useSnackbarStore } from "@/stores/snackbar-store";
import type {
  ButtonInfo,
  CancelCleaningCommand,
  DeviceNotification,
  GetButtonsInfoCommand,
  GetDeviceInfoCommand,
  GetTemperatureCommand,
  GetWeightCommand,
  MakeTeaCommand,
  SetButtonInfoCommand,
  SetDispensingModeCommand,
  SetTargetTotalMlCommand,
  StartCleaningCommand,
} from "@/types/device";
import type { TeaIngredients } from "@/types/tea";
import { BluetoothService } from "../bluetooth";

export const DeviceService = {
  send: {
    makeTea: (ingredients: TeaIngredients) => {
      const command: MakeTeaCommand = {
        type: "MAKE_TEA",
        payload: ingredients,
      };
      BluetoothService.sendJson(command);
    },

    getButtonsInfo: () => {
      const command: GetButtonsInfoCommand = {
        type: "GET_BUTTONS_INFO",
      };
      BluetoothService.sendJson(command);
    },

    setButtonInfo: (id: 0 | 1 | 2, info: ButtonInfo) => {
      const command: SetButtonInfoCommand = {
        type: "SET_BUTTON_INFO",
        payload: {
          id,
          ...info,
        },
      };
      BluetoothService.sendJson(command);
    },

    getDeviceInfo: () => {
      const command: GetDeviceInfoCommand = {
        type: "GET_DEVICE_INFO",
      };
      BluetoothService.sendJson(command);
    },

    getTemperature: () => {
      const command: GetTemperatureCommand = {
        type: "GET_TEMPERATURE",
      };
      BluetoothService.sendJson(command);
    },

    getWeight: () => {
      const command: GetWeightCommand = {
        type: "GET_WEIGHT",
      };
      BluetoothService.sendJson(command);
    },

    setDispensingMode: (weightMode: boolean) => {
      const command: SetDispensingModeCommand = {
        type: "SET_DISPENSING_MODE",
        payload: { weightMode },
      };
      BluetoothService.sendJson(command);
    },

    setTargetTotalMl: (targetTotalMl: number) => {
      const command: SetTargetTotalMlCommand = {
        type: "SET_TARGET_TOTAL_ML",
        payload: { targetTotalMl },
      };
      BluetoothService.sendJson(command);
    },

    startCleaning: () => {
      const command: StartCleaningCommand = {
        type: "START_CLEANING",
      };
      BluetoothService.sendJson(command);
    },

    cancelCleaning: () => {
      const command: CancelCleaningCommand = {
        type: "CANCEL_CLEANING",
      };
      BluetoothService.sendJson(command);
    },
  },

  handleNotification: (base64Value: string) => {
    const store = useDeviceStore.getState();
    const snackbar = useSnackbarStore.getState();

    try {
      const decoded = Buffer.from(base64Value, "base64").toString("utf-8");
      const { type, payload } = JSON.parse(decoded) as DeviceNotification;

      console.log(`[HANDLE] type: ${type}, payload:`, payload);

      switch (type) {
        case "BUTTONS_INFO":
          store.setButtonInfos(payload);
          break;

        case "DEVICE_INFO":
          store.setDeviceInfo(payload);
          break;

        case "TEMPERATURE":
          store.updateTemperature(payload.temperature);
          break;

        case "WEIGHT":
          store.updateWeight(payload.weight);
          break;

        case "TEA_START":
          store.teaStart(payload);
          break;

        case "TEA_PROGRESS": {
          const { percentage, ...current } = payload;
          store.teaProgress(current, percentage);
          break;
        }

        case "TEA_FINISH":
          store.teaFinish();
          snackbar.toast("Finished! Enjoy your tea");
          break;

        case "CUP_REMOVED":
          store.cupRemoved();
          break;

        case "CUP_WARNING":
          store.cupWarning();
          snackbar.toast("Warning: Cup removed during dispensing!");
          break;

        case "CLEANING_START":
          store.cleaningStart(payload.durationSeconds);
          break;

        case "CLEANING_PROGRESS":
          store.updateCleaningProgress(
            payload.progress,
            payload.remainingSeconds,
          );
          break;

        case "CLEANING_FINISHED":
          store.cleaningFinish();
          break;

        case "CLEANING_CANCELLED":
          store.cleaningCancel();
          snackbar.toast("Cleaning cancelled.");
          break;

        case "ERROR":
          snackbar.toast(payload.message || "Something went wrong");
          break;
      }
    } catch (error) {
      console.error("Failed to parse device notification:", error);
    }
  },
};
