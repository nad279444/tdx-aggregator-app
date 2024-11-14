import { SILOS } from "../../constants/Constants";
import * as FileSystem from "expo-file-system";
import { fetchAndSaveJson, syncJson, offlineLoad } from "../../functions/getOfflineUtils";
import { normalizeArray } from "../../functions/normalization";

export const silos = {
  fileName: "silos.json",
  filePath: `${FileSystem.documentDirectory}silos.json`,
  fetchAndSync: async () => {
    try {
      await fetchAndSaveJson(SILOS, silos.filePath,normalizeArray);
      await syncJson(SILOS, silos.filePath, silos.loadJsonFromFile,normalizeArray);
    } catch (error) {
      console.error("Failed to fetch commodities:", error.message);
      throw error;
    }
  },
  // Load JSON data from local file storage
  loadJsonFromFile: async () => {
    try {
      return await offlineLoad(SILOS, silos.filePath,normalizeArray);
    } catch (error) {
      console.error("Error loading file:", error.message);
      return null;
    }
  },
};
