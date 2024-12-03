import { StorageEnum } from "@/lib/storage";
import { createStorage } from "@/lib/storage";

export interface DisplayStyle {
  placement: "bottom-right";
  offset: number;
  backgroundColor: string;
  textColor: string;
  fontSize: string;
  borderWidth: string;
  borderColor: string;
  opacity: number;
}

export interface CustomizationConfig {
  displayStyle: DisplayStyle;
}

export const DEFAULT_CONFIG: CustomizationConfig = {
  displayStyle: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    textColor: "#ffffff",
    fontSize: "12px",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: "1px",
    opacity: 0.9,
    placement: "bottom-right",
    offset: 20,
  },
};

export class ConfigManager {
  private static customizationConfig = createStorage<CustomizationConfig>(
    "mailmood_customization_config",
    DEFAULT_CONFIG,
    {
      storageEnum: StorageEnum.Local,
      liveUpdate: true,
    }
  );

  public static async getConfig(): Promise<CustomizationConfig> {
    return this.customizationConfig.get();
  }
}
