import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { DataContext } from "../../../DBContext";
import { farmers } from "../../controllers/api/farmerList";

const AddFarmerScreen3 = ({ route, navigation }) => {
  const [community, setCommunity] = useState("");
  const [experienceYear, setExperienceYear] = useState("");

  const { addFarmer } = useContext(DataContext);

  useEffect(() => {
    navigation.setOptions({
      title: "Farmers",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
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
  const {
    previousData,
    mobileNumber,
    network,
    altMobileNumber,
    altNetWork,
    gender,
  } = route.params;
  const { fullName, idCardNumber, idCardType } = previousData;
  const handleFarmer = async () => {
    try {
      const response = await farmers.add({
        biodata: {
          fullname: fullName,
          mobilenumber: mobileNumber,
          network: network,
          altmobilenumber: altMobileNumber,
          altnetwork: altNetWork,
          gender: gender,
          community: community,
          experience_year: experienceYear,
          idcardtype: idCardType,
          idcardnumber: idCardNumber,
        },
      });
      if (!response.error) {
        ToastAndroid.showWithGravityAndOffset(
          response.message,
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
      
    }
   
    navigation.navigate("");
    setCommunity("");
    setExperienceYear("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Community</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter Community"
            onChangeText={(text) => setCommunity(text)}
            value={community}
          />
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
        disabled={!community || !experienceYear}
      >
        <Text style={{ fontSize: 18, color: "white" }}>Add farmer</Text>
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
