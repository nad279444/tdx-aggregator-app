import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";
import axios from "axios";



export async function storeOfflineRequest (path,request) {
    try {
        // Read existing offline requests
        let offlineRequests = [];
        const fileExists = await FileSystem.getInfoAsync(path);
        if (fileExists.exists) {
          const fileContents = await FileSystem.readAsStringAsync(path);
          offlineRequests = JSON.parse(fileContents);
        }
        
        // Add the new request
        offlineRequests.push(request);
        await FileSystem.writeAsStringAsync(path, JSON.stringify(offlineRequests));
      } catch (error) {
        console.error('Failed to store request offline:', error);
      }
    
}




  export async function retryOfflineRequests (path){
    try {
      const file = await FileSystem.readAsStringAsync(path);
      const offlineRequests = JSON.parse(file);
  
      const remainingRequests = [];
      for (const request of offlineRequests) {
        try {
          await axios.post(request.url, request.payload);
        } catch (error) {
          remainingRequests.push(request); // Keep request if it fails
        }
      }
  
      // Update the file with any remaining requests
      await FileSystem.writeAsStringAsync(path, JSON.stringify(remainingRequests));
    } catch (error) {
      console.log('Error retrying offline requests:', error);
    }
  };
 
  
