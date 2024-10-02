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
import { DataContext } from "../../../DBContext";
import { farmers } from "../../controllers/api/farmerList";
import { communities } from "../../controllers/api/communities";
import * as FileSystem from "expo-file-system";

const AddFarmerScreen3 = ({ route, navigation }) => {
  const [community, setCommunity] = useState("");
  const [communityList, setCommunityList] = useState([]);
  const [experienceYear, setExperienceYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { addFarmer } = useContext(DataContext);

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
    (async function getCommunities() {
      try {
        const response = await communities.get();
        setCommunityList(response);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    })();
  }, []);
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
  const {
    previousData,
    mobileNumber,
    network,
    altMobileNumber,
    altNetWork,
    gender,
  } = route.params;
  const { fullName, idCardNumber, idCardType, frontImageUri, backImageUri } =
    previousData;
  const handleFarmer = async () => {
    setIsLoading(true)
    try {
      const frontImageBase64 = await convertImageToBase64(frontImageUri);
      const backImageBase64 = await convertImageToBase64(backImageUri);
      
      const response = await farmers.add({
        biodata: {
          fullname: fullName,
          mobilenumber: mobileNumber,
          network: network,
          altmobilenumber: altMobileNumber,
          altnetwork: altNetWork,
          gender: gender,
          community: community,
          frontimg: frontImageBase64,
          backimg: backImageBase64,
          experience_year: experienceYear,
          idcardtype: idCardType,
          idcardnumber: idCardNumber,
        },
      });
    
      if (!response.error) {
        ToastAndroid.showWithGravityAndOffset(
          response.message || 'Farmer Added Succesfully',
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
    }finally{
      setIsLoading(false)
    } 

    navigation.navigate("ManageFarmersScreen");
    fullName
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
          <Text style={styles.inputTitle}>Experience Year</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="The year you started farming"
            keyboardType="numeric"
            onChangeText={(num) => setExperienceYear(num)}
            value={experienceYear}
          />
        </View>
      </View>

      <TouchableOpacity
        style={
          community && experienceYear 
            ? styles.greenButton
            : styles.disabledButton
        }
        onPress={handleFarmer}
        disabled={!community || !experienceYear || isLoading }
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
    textAlign: "right",
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
  imagePreviewContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  picker: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
});

export default AddFarmerScreen3;
