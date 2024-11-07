import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { DataContext } from "../../../DBContext";

const AddFarmerScreen2 = ({ route, navigation }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [altMobileNumber, setAltMobileNumber] = useState("");
  const [network, setNetwork] = useState("");
  const [altNetWork, setAltNetWork] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(""); // New state for age
  const [mobileError, setMobileError] = useState("");

  const { addFarmer } = useContext(DataContext);
  const previousData = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: "Farmers",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddFarmerScreen')}
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

  const validatePhone = (input) => {
    const phoneRegex = /^\d{10}$/; // Exactly 10 digits
    return phoneRegex.test(input);
  };
  const handlePhoneChange = (input) => {
    setMobileNumber(input);
    if (validatePhone(input)) {
      setMobileError("");
    } else {
      setMobileError("✗ Invalid phone number.");
    }
  };
  const handleAltPhoneChange = (input) => {
    setAltMobileNumber(input);
    if (validatePhone(input)) {
      setMobileError("");
    } else {
      setMobileError("✗ Invalid phone number.");
    }
  };

  const handleNext = () => {
    navigation.navigate("AddFarmerScreen3", {
      previousData,
      mobileNumber,
      network,
      altMobileNumber,
      altNetWork,
      gender,
      age,
    });
    setMobileNumber("");
    setNetwork("");
    setAltMobileNumber("");
    setAltNetWork("");
    setGender("");
    setAge("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={[styles.inputGroup, styles.phoneInput]}>
          <Text style={styles.inputTitle}>Phone Number</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter Phone Number"
            onChangeText={handlePhoneChange}
            value={mobileNumber}
            keyboardType="numeric"
          />
        </View>

        {/* Network Picker Input (25% width) */}
        <View style={[styles.inputGroup, styles.networkInput]}>
          <Text style={styles.inputTitle}>Network</Text>
          <Picker
            selectedValue={network}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setNetwork(itemValue)}
          >
            <Picker.Item label="SELECT" value="" />
            <Picker.Item label="MTN" value="mtn" />
            <Picker.Item label="Telecel" value="telecel" />
          </Picker>
        </View>
      </View>

      {/* Alternative phone number */}
      <View style={styles.inputContainer}>
        <View style={[styles.inputGroup, styles.phoneInput]}>
          <Text style={styles.inputTitle}>Alternative Number</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter Phone Number"
            onChangeText={handleAltPhoneChange}
            value={altMobileNumber}
            keyboardType="numeric"
          />
        </View>

        {/* Alt Network Picker Input (25% width) */}
        <View style={[styles.inputGroup, styles.networkInput]}>
          <Text style={styles.inputTitle}>Alt Network</Text>
          <Picker
            selectedValue={altNetWork}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setAltNetWork(itemValue)}
          >
            <Picker.Item label="SELECT" value="" />
            <Picker.Item label="MTN" value="mtn" />
            <Picker.Item label="Telecel" value="telecel" />
          </Picker>
        </View>
      </View>

      {mobileError ? (
        <Text style={{ color: "red", marginLeft: 10 }}>{mobileError}</Text>
      ) : null}

      {/* Gender and Age inputs */}
      <View style={styles.inputContainer}>
        <View style={[styles.inputGroup, styles.phoneInput]}>
          <Text style={styles.inputTitle}>Gender</Text>
          <Picker
            selectedValue={gender}
            style={styles.nameInput}
            onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
          >
            <Picker.Item label="SELECT" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        <View style={[styles.inputGroup, styles.networkInput]}>
          <Text style={styles.inputTitle}>Age</Text>
          <TextInput
            style={styles.ageInput}
            placeholder="Enter Age"
            keyboardType="numeric"
            value={age}
            onChangeText={(input) => setAge(input)}
          />
        </View>
      </View>

      <TouchableOpacity
        style={
          mobileNumber && network && gender && age
            ? styles.greenButton
            : styles.disabledButton
        }
        onPress={handleNext}
        disabled={!mobileNumber || !network || !gender || !age}
      >
        <Text style={{ fontSize: 18, color: "white" }}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft:5,
    paddingRight: 15
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
  phoneInput: {
    flexBasis: "60%", // Takes 60% width of the row
  
  },
  networkInput: {
    flexBasis: "25%",
  },
  inputTitle: {
    marginLeft: 10,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  nameInput: {
    height: 57,
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
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
  },
  disabledButton: {
    marginTop: 30,
    height: 50,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    backgroundColor: "#D5D8DE",
    alignItems: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "white",
  },
  ageInput: {
    height: 57,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "white",
    padding:15
  },
});

export default AddFarmerScreen2;
