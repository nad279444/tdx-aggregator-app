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
import { ScrollView } from "react-native-gesture-handler";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const AddFarmerScreen = ({ route, navigation }) => {
  const [fullName, setFullName] = useState("");
  const [nameError, setNameError] = useState("");
  const [idCardType, setIdCardType] = useState("");
  const [idCardNumber, setIdCardNumber] = useState("");
  
  

  const { addFarmer } = useContext(DataContext);

  useEffect(() => {
    navigation.setOptions({
      title: "Farmers",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('ManageFarmersScreen')}
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
  const handleIdCardTypeChange = (itemValue) => {
    setIdCardType(itemValue);
    
    if (itemValue === "ghana_card") {
      setIdCardNumber("GHA-"); // Immediately set "GHA-" when Ghana Card is selected
    } else {
      setIdCardNumber(""); // Clear the field for other card types
    }
  };
  
  const handleIdCardNumberChange = (num) => {
    if (idCardType === "ghana_card") {
      // Ensure the prefix "GHA-" is always there
      if (num.startsWith("GHA-")) {
        setIdCardNumber(num);
      } else {
        setIdCardNumber(`GHA-${num}`);
      }
    } else {
      setIdCardNumber(num);
    }
  };
  
  
  const handleFarmer = async () => {
    navigation.navigate("AddFarmerScreen2",{fullName,idCardNumber,idCardType});
    setFullName("");
    setIdCardType("");
    setIdCardNumber("");
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Full Name</Text>
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
      <View style={[styles.inputContainer, { marginHorizontal:10, marginBottom:20 }]}>
        <View style={styles.inputGroup}>
        <Text style={[styles.inputTitle,{marginLeft:0}]}>ID Card Type</Text>
          <Picker
            selectedValue={idCardType} // Current selected value
            style={styles.picker} // Style for the picker
            onValueChange={handleIdCardTypeChange} // Handle the change
          >
            <Picker.Item label="Voters ID" value="voters" />
            <Picker.Item label="Ghana Card" value="ghana_card" />
          </Picker>
        </View>
      </View> 
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>ID Card Number</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter ID Number"
            keyboardType="numeric"
            onChangeText={handleIdCardNumberChange}
            value={idCardNumber}
          />
        </View>
      </View>
      
      
      <View style={{flexDirection:'row',justifyContent:'space-around'}}>
     
      </View>
     
      <TouchableOpacity
        style={
          fullName
            ? styles.greenButton
            : styles.disabledButton
        }
        onPress={handleFarmer}
        disabled={!fullName}
      >
        <Text style={{ fontSize: 18, color: "white" }}>Continue</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
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
    height: hp('7'),
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
    height: hp('7'),
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
  },
  disabledButton: {
    marginTop: 30,
    height: hp('7'),
    marginHorizontal: 10,
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
    height:hp('7'),
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
});

export default AddFarmerScreen;
