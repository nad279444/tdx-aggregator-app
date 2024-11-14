import { COMMODITIES, COMMODITIES_RATES } from "../../constants/Constants"
import * as FileSystem from "expo-file-system";
import { fetchAndSaveJson, syncJson,offlineLoad } from "../../functions/getOfflineUtils";
import { normalizeArray } from "../../functions/normalization";

export const commodities = {
  fileName: "commodities.json",
  filePath: `${FileSystem.documentDirectory}commodities.json`,
  fetchAndSync: async () => {
    try {
      await fetchAndSaveJson(COMMODITIES_RATES, commodities.filePath,normalizeArray);
      await syncJson(
        COMMODITIES_RATES,
        commodities.filePath,
        commodities.loadJsonFromFile,
        normalizeArray
      );
    } catch (error) {
      console.error("Failed to fetch commodities:", error.message);
      throw error;
    }
  },
  // Load JSON data from local file storage
  loadJsonFromFile: async () => {
    try {
     return await offlineLoad(COMMODITIES_RATES,commodities.filePath,normalizeArray)
    } catch (error) {
      console.log(error)
      
    }
  }
  
  
};
