import AsyncStorage from "@react-native-async-storage/async-storage";
const AuthTokenStore = {
    getToken: async () => {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  },
  getUserID: async () => {
    const id = await AsyncStorage.getItem('user_id');
    return id;
  },
  getUserData: async () => {
    const data = await AsyncStorage.getItem('user_data');
    return data;
  },
  
};

export default AuthTokenStore;