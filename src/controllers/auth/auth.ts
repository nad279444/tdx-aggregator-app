import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { JSHash, JSHmac, CONSTANTS } from 'react-native-hash';
import { BASE_URL } from '../../constants/Constants';
import { usePushNotifications } from '../../functions/useNotifications';
import * as  FileSystem from 'expo-file-system'
import {storeOfflineRequest,retryOfflineRequests} from '../../functions/postOfflineUtils';


const auth = {
  registerOfflinePath: `${FileSystem.documentDirectory}registerOfflineRequests.json`,
  postRequest: async (endpoint, data) => {
    try {
      const response = await axios.post(`${BASE_URL}/${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error in ${endpoint}`, error);
      throw error;
    }
  },

  offlineRequest: async (endpoint,data) => {
    try {
      const url = `${BASE_URL}/${endpoint}`;
      return await axios.post(url, data);
    } catch (error) {
       if (!error.response && (error.code === "ECONNABORTED" || error.message.includes("Network Error"))) {
      await storeOfflineRequest(auth.registerOfflinePath, { endpoint, data });
      await auth.retryOffline()
    } else {
      console.error("Non-network error occurred:", error);
      throw error;
    }
    }
  },
  retryOffline: async () => {
    await retryOfflineRequests(auth.registerOfflinePath)
  },
  signUp: async (registrationData) => {
     return await auth.offlineRequest("signup",registrationData);

  },

  signIn: async ({username, password}) => {
    const challengeData = await auth.getChallenge(username);
    
    if (!challengeData.challenge) {
      alert("User not found");
      return null;
    }

    const challenge = challengeData.challenge;

    // Hash password using JSHash
    const sha256Password = await JSHash(password, CONSTANTS.HashAlgorithms.sha256);

    // Generate HMAC using JSHmac
    const responseToken = await JSHmac(challenge, sha256Password, CONSTANTS.HmacAlgorithms.HmacSHA256);
   
    const validationResult = await auth.validateResponse(responseToken);
     
    if (validationResult.message == "Success") {
      return validationResult
    } else {
      alert("Login failed");
      return null;
    }
  },

  signOut: async () => {
    await SecureStore.deleteItemAsync("userToken");
  },

  forgotPassword: async (data) => {
    return auth.postRequest("resetpassword", data);
  },

  confirmOTP: async ({otp,mobile,password,confirmpassword}) => {
    console.log({otp,mobile,password,confirmpassword})
    return auth.postRequest(`resetpassword/${otp}`,{mobile,password,confirmpassword});
  },

  getChallenge: async (username) => {
    return auth.postRequest(`get_challenge/${username}`, {username });
  },
  

  validateResponse: async (token) => {
    const expoToken = await SecureStore.getItemAsync('expoPushToken');
    const extractedId = expoToken ? expoToken.split('[')[1].split(']')[0] : '';
    console.log('deviceId',extractedId)
    return auth.postRequest(`validate_response/${token}/${extractedId}`,'');
  },

  // Methods using react-native-hash
  hashHMAC: async (message, key) => {
    return await JSHmac(message, key, CONSTANTS.HmacAlgorithms.HmacSHA256);
  },


};

export default auth;
