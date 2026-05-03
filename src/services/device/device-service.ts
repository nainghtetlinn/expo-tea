import { Buffer } from "buffer";
import { useDeviceStore } from "@/stores/device-store";
import type {
  ButtonInfo,
  DeviceNotification,
  GetButtonsInfoCommand,
  MakeTeaCommand,
  SetButtonInfoCommand,
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
  },

  handleNotification: (base64Value: string) => {
    const store = useDeviceStore.getState();
    try {
      const decoded = Buffer.from(base64Value, "base64").toString("utf-8");
      const { type, payload } = JSON.parse(decoded) as DeviceNotification;

      console.log(`[HANDLE] type: ${type}, payload:`, payload);

      switch (type) {
        case "TEA_START":
          store.setDeviceData({
            isMaking: true,
            targetIngredients: payload,
            currentProgress: {
              tea: 0,
              condensedMilk: 0,
              evaporatedMilk: 0,
              milk: 0,
            },
            progress: 0,
          });
          break;

        case "TEA_PROGRESS":
          store.setDeviceData({ currentProgress: payload });
          store.calculateProgress();
          break;

        case "TEA_FINISH":
          store.setDeviceData({
            isMaking: false,
            targetIngredients: null,
            currentProgress: null,
          });
          break;

        case "BUTTONS_INFO":
          store.setDeviceData({ buttonInfos: payload });
          break;

        case "ERROR":
          console.log(payload);
          break;
      }
    } catch (error) {
      console.error("Failed to parse device notification:", error);
    }
  },
};
