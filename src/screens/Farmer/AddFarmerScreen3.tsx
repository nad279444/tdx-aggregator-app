import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker'; // Import the Image Picker
import { DataContext } from "../../../DBContext";
import { farmers } from "../../controllers/api/farmerList";
import { communities } from "../../controllers/api/communities";
import * as FileSystem from "expo-file-system";
import NetInfo from '@react-native-community/netinfo';

const AddFarmerScreen3 = ({ route, navigation }) => {
  const [community, setCommunity] = useState("");
  const [communityList, setCommunityList] = useState([]);
  const [experienceYear, setExperienceYear] = useState("");
  const [frontImageUri, setFrontImageUri] = useState(null);
  const [backImageUri, setBackImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline,setIsOnline] = useState(false)


  const { addFarmer } = useContext(DataContext);
  const {previousData} = route.params
  useEffect(() => {
    navigation.setOptions({
      title: "Farmers",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("AddFarmerScreen")}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const loadLocalData = async () => {
        try {
            const localData = await communities.loadJsonFromFile();
            if (localData) {
                setCommunityList(localData.data);
            } else {
                console.log("No local data available.");
            }
        } catch (error) {
            console.error("Error loading data from local storage:", error);
        }
    };

    const handleNetworkChange = async (isConnected) => {
        setIsOnline(isConnected);
        if (isConnected) {
            try {
                await communities.fetchAndSync();
                const localData = await communities.loadJsonFromFile();
                if (localData) {
                    setCommunityList(localData.data);
                } else {
                    console.log("No local data available after sync.");
                }
            } catch (error) {
                console.error("Error syncing data:", error);
            } 
        }
    };

    // Load local data immediately on component mount (offline-first)
    loadLocalData();

    // Listen for network status changes
    const unsubscribe = NetInfo.addEventListener(state => {
        handleNetworkChange(state.isConnected);
    });

    // Clean up the event listener
    return () => unsubscribe();
}, []);

  // Request camera permissions and capture image from camera
  const pickImage = async (setter) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setter(result.assets[0].uri); // Set the image URI for front or back image
    }
  };

  const convertImageToBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }
  };

  const handleFarmer = async () => {
    setIsLoading(true);
    try {
      const frontImageBase64 = await convertImageToBase64(frontImageUri);
      const backImageBase64 = await convertImageToBase64(backImageUri);

      const response = await farmers.add({
        biodata: {
          fullname: previousData.fullName || "",
          mobilenumber: route.params.mobileNumber || "",
          network: route.params.network || "",
          altmobilenumber: route.params.altMobileNumber || "",
          altnetwork: route.params.altNetWork || "",
          gender: route.params.gender || "",
          community: community || "",
          frontimg: frontImageBase64 || "",
          backimg: backImageBase64 || "",
          experience_year: experienceYear || "",
          idcardtype: previousData.idCardType || "",
          idcardnumber: previousData.idCardNumber || "",
          age: route.params.age || "",
          accountype: "FARMER"
        },
        farmdata:{},
      });

      if (!response.error) {
        ToastAndroid.showWithGravityAndOffset(
          response.message || 'Farmer Added Successfully',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50
        );
      } else {
        ToastAndroid.showWithGravityAndOffset(
          response.message,
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50
        );
      }
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50
      );
    } finally {
      setIsLoading(false);
    }

    navigation.navigate("ManageFarmersScreen");
    setCommunity("");
    setExperienceYear("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Community</Text>
          <Picker
            selectedValue={community}
            onValueChange={(itemValue) => setCommunity(itemValue)}
            style={styles.nameInput}
          >
            <Picker.Item label="Select a community" value="" />
            {communityList?.map((communityItem) => (
              <Picker.Item
                key={communityItem.id}
                label={communityItem.name}
                value={communityItem.id}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Years of Experience</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder=""
            keyboardType="numeric"
            onChangeText={(num) => setExperienceYear(num)}
            value={experienceYear}
          />
        </View>
      </View>

      {/* Image capture and display */}
      <View style={styles.imageCaptureContainer}>
        <Text style={styles.inputTitle}>Capture Front ID</Text>
        <TouchableOpacity onPress={() => pickImage(setFrontImageUri)}>
          <View style={styles.imagePreviewContainer}>
            {frontImageUri ? (
              <Image source={{ uri: frontImageUri }} style={styles.imagePreview} />
            ) : (
              <Ionicons name="camera" size={50} color="#ccc" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.imageCaptureContainer}>
        <Text style={styles.inputTitle}>Capture Back ID</Text>
        <TouchableOpacity onPress={() => pickImage(setBackImageUri)}>
          <View style={styles.imagePreviewContainer}>
            {backImageUri ? (
              <Image source={{ uri: backImageUri }} style={styles.imagePreview} />
            ) : (
              <Ionicons name="camera" size={50} color="#ccc" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.greenButton}
        onPress={handleFarmer}
    
      >
        <Text style={{ fontSize: 18, color: "white" }}>Add farmer</Text>
        {isLoading && (
          <ActivityIndicator
            style={{ position: "absolute", top: 15, right: 30 }}
            size="small"
            color="#fff"
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  inputGroup: {
    flex: 1,
    position: "relative",
  },
  inputTitle: {
    marginLeft: 10,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  nameInput: {
    height: 60,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 4,
    padding: 10,
    marginHorizontal: 10,
    textAlign: "left",
    backgroundColor: "#FFFFFF",
  },
  greenButton: {
    backgroundColor: "#21893E",
    marginTop: 30,
    height: 50,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
  },
  disabledButton: {
    marginTop: 30,
    height: 50,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    backgroundColor: "#D5D8DE",
    alignItems: "center",
  },
  imageCaptureContainer: {
    marginTop: 20,
  },
  imagePreviewContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
});

export default AddFarmerScreen3;
