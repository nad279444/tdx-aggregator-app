import { COMMODITIES, COMMODITIES_RATES } from "../../constants/Constants"
import * as FileSystem from "expo-file-system";
import { fetchAndSaveJson, syncJson } from "../../functions/utils";

export const commodities = {
  fileName: "commodities.json",
  filePath: `${FileSystem.documentDirectory}commodities.json`,
  fetchAndSync: async () => {
    try {
      await fetchAndSaveJson(COMMODITIES_RATES, commodities.filePath);
      await syncJson(
        COMMODITIES_RATES,
        commodities.filePath,
        commodities.loadJsonFromFile
      );
    } catch (error) {
      console.error("Failed to fetch commodities:", error.message);
      throw error;
    }
  },
  // Load JSON data from local file storage
  loadJsonFromFile: async () => {
    try {
      const fileExists = await FileSystem.getInfoAsync(commodities.filePath);

      if (fileExists.exists) {
        const data = await FileSystem.readAsStringAsync(commodities.filePath, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        console.log("Loaded data from file:", data);

        const jsonData = JSON.parse(data);

        return jsonData;
      } else {
        console.log("File does not exist");
        return null;
      }
    } catch (error) {
      console.error("Error loading file:", error.message);
      return null;
    }
  },
  
};
