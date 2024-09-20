import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { DataContext } from "../../../DBContext";

const AddFarmerScreen = ({ route, navigation }) => {
  const [fullName, setFullName] = useState("");
  const [nameError, setNameError] = useState("");
  const [idCardType, setIdCardType] = useState("");
  const [idCardNumber, setIdCardNumber] = useState("");
  const { imageUri } = route.params;

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

 

  const validateFullName = (input) => {
    const nameParts = input.trim().split(" ");
    if (nameParts.length >= 2) {
      const lastName = nameParts.pop();
      const firstName = nameParts.join(" ");
      return `${firstName} ${lastName}`;
    } else {
      setNameError("✗ Please enter both first and last name.");
    }
  };
  const handleFullNameChange = (input) => {
    setFullName(input);
    const validatedName = validateFullName(input);
    if (validatedName) {
      setNameError(""); // Clear error message
      // Set the full name
    } else {
      setNameError("✗ Please enter both first and last name."); // Show error
    }
  };

  const handleFarmer = async () => {
    navigation.navigate("AddFarmerScreen2",{fullName,idCardNumber,idCardType});
    setFullName("");
    setIdCardType("");
    setIdCardNumber("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>FUll Name</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter Full Name"
            onChangeText={handleFullNameChange}
            value={fullName}
          />
        </View>
      </View>
      {nameError ? (
        <Text style={{ color: "red", marginLeft: 10 }}>{nameError}</Text>
      ) : null}

      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>ID Card Number</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter ID Number"
            keyboardType="numeric"
            onChangeText={(num) => setIdCardNumber(num)}
            value={idCardNumber}
          />
        </View>
      </View>
      <View style={[styles.inputContainer, { marginHorizontal: 10, marginBottom:20 }]}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>ID Card Type</Text>
          <Picker
            selectedValue={idCardType} // Current selected value
            style={styles.picker} // Style for the picker
            onValueChange={(itemValue, itemIndex) => setIdCardType(itemValue)} // Handle the change
          >
            <Picker.Item label="Voters ID" value="voters" />
            <Picker.Item label="Ghana Card" value="ghana_card" />
          </Picker>
        </View>
      </View>
      {imageUri && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        </View>
      )}
      <TouchableOpacity
        style={
          fullName && idCardNumber && idCardType
            ? styles.greenButton
            : styles.disabledButton
        }
        onPress={handleFarmer}
        disabled={!fullName || !idCardNumber || !idCardType}
      >
        <Text style={{ fontSize: 18, color: "white" }}>Continue</Text>
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

export default AddFarmerScreen;
