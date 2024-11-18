import { COMMUNITIES,COMMUNITY_RATES,REGISTER_COMMUNITIES } from "../../constants/Constants";
import * as FileSystem from "expo-file-system";
import { fetchAndSaveJson, syncJson ,offlineLoad} from "../../functions/getOfflineUtils";
import { communityFetchAndSaveJson,communitySyncJson,communityOfflineLoad } from "../../functions/register_communities";
import { normalizeArray } from "../../functions/normalization";


export const communityRates = {
    fileName: "communityRates.json",
    filePath: `${FileSystem.documentDirectory}communityRates.json`,
    fetchAndSync: async () => {
      try {
        await fetchAndSaveJson(COMMUNITY_RATES, communityRates.filePath,normalizeArray);
        await syncJson(
          COMMUNITY_RATES,
          communityRates.filePath,
          communityRates.loadJsonFromFile,
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
      return await offlineLoad(COMMUNITY_RATES,communityRates.filePath,normalizeArray)
      } catch (error) {
        console.error("Error loading file:", error.message);
        return null;
      }
    },
    
};


export const communities = {
  fileName: "communities.json",
  filePath: `${FileSystem.documentDirectory}communities.json`,
  fetchAndSync: async () => {
    try {
      await fetchAndSaveJson(COMMUNITIES, communities.filePath,normalizeArray);
      await syncJson(
        COMMUNITIES,
        communities.filePath,
        communities.loadJsonFromFile,
        normalizeArray
      );
    } catch (error) {
      console.error("Failed to fetch communities:", error.message);
      throw error;
    }
  },
  // Load JSON data from local file storage
  loadJsonFromFile: async () => {
    try {
    return await offlineLoad(COMMUNITIES,communities.filePath,normalizeArray)
    } catch (error) {
      console.error("Error loading file:", error.message);
      return null;
    }
  },
  
};


export const register_communities = {
  fileName: "register_communities.json",
  filePath: `${FileSystem.documentDirectory}register_communities.json`,
  fetchAndSync: async () => {
    try {
      await communityFetchAndSaveJson(REGISTER_COMMUNITIES, register_communities.filePath,normalizeArray);
      await communitySyncJson(
        REGISTER_COMMUNITIES,
        register_communities.filePath,
        register_communities.loadJsonFromFile,
        normalizeArray
      );
    } catch (error) {
      console.error("Failed to fetch register communities:", error.message);
      throw error;
    }
  },
  // Load JSON data from local file storage
  loadJsonFromFile: async () => {
    try {
    return await communityOfflineLoad(REGISTER_COMMUNITIES,register_communities.filePath,normalizeArray)
    } catch (error) {
      console.error("Error loading file:", error.message);
      return null;
    }
  },
  
};


