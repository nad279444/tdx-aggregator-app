import { COMMUNITIES,COMMUNITY_RATES } from "../../constants/Constants";
import * as FileSystem from "expo-file-system";
import { fetchAndSaveJson, syncJson } from "../../functions/utils";


export const communityRates = {
    fileName: "communityRates.json",
    filePath: `${FileSystem.documentDirectory}communityRates.json`,
    fetchAndSync: async () => {
      try {
        await fetchAndSaveJson(COMMUNITY_RATES, communityRates.filePath);
        await syncJson(
          COMMUNITY_RATES,
          communityRates.filePath,
          communityRates.loadJsonFromFile
        );
      } catch (error) {
        console.error("Failed to fetch commodities:", error.message);
        throw error;
      }
    },
    // Load JSON data from local file storage
    loadJsonFromFile: async () => {
      try {
        const fileExists = await FileSystem.getInfoAsync(communityRates.filePath);
  
        if (fileExists.exists) {
          const data = await FileSystem.readAsStringAsync(communityRates.filePath, {
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


