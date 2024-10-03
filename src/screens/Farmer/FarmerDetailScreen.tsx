import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DataContext } from "../../../DBContext";
import { farmers } from "../../controllers/api/farmerList";

export default function FarmerDetailScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [farmerToken, setFarmerToken] = useState("");
  const [communityId, setCommunityId] = useState("");

  const { data, updateData } = useContext(DataContext);
  console.log(data.icon)

  useEffect(() => {
    navigation.setOptions({
      title: "Sell Direct",
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

  useEffect(() => {
    const verifyFarmer = async () => {
      const { mobile, token, community_id } = await farmers.getOne(phoneNumber);
      if (mobile == phoneNumber) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
      setCommunityId(community_id);
      setFarmerToken(token);
    };
    verifyFarmer();
  }, [phoneNumber]);

  const saveDataToDB = () => {
    updateData("phoneNumber", phoneNumber);
    updateData("farmerToken", farmerToken);
    updateData("communityId", communityId);
  };

  const validatePhone = (input) => {
    const phoneRegex = /^\d{10}$/; // Exactly 10 digits
    return phoneRegex.test(input);
  };

  const handlePhoneChange = (input) => {
    setPhoneNumber(input);
    if (validatePhone(input)) {
      setPhoneError("");
    } else {
      setPhoneError("✗ Invalid number.");
    }
  };

  const handleNext = () => {
    if (isVerified) {
      saveDataToDB();
      navigation.navigate("QualityControlScreen");
      setPhoneNumber("");
      setCommunityId("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.blackBox}>
        <View style={styles.commodityContainer}>
          <Image source={{uri:data.icon}} style={styles.icon}/>
          <View style={{ marginLeft: 5 }}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
              {data.commodity}
            </Text>
            <Text style={{ color: "#94E081", fontSize: 14, fontWeight: "500" }}>
              {data.bags} bags, {data.weight} KG
            </Text>
          </View>
        </View>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
          {data.totalPrice} ₵
        </Text>
      </View>
      <View style={{ marginLeft: 20, marginTop: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Enter Farmer Details
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Phone Number</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter Your Phone Number"
            onChangeText={handlePhoneChange}
            keyboardType="numeric"
            value={phoneNumber}
          />
          {isVerified && (
            <Ionicons
              name="checkmark-outline"
              size={20}
              color="#21893E"
              style={styles.checked}
            />
          )}
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 10,
          marginRight: 20,
        }}
      >
        {phoneError ? (
          <Text style={{ color: "red", marginRight: 60 }}>{phoneError}</Text>
        ) : null}
        {isVerified ? (
          <Text style={{ color: "green" }}>Farmer details verified</Text>
        ) : (
          <Text style={{ color: "red" }}>Farmer could not be found</Text>
        )}
      </View>
      <TouchableOpacity
        style={isVerified ? styles.greenButton : styles.disabledButton}
        onPress={handleNext}
        disabled={!isVerified}
      >
        <Text style={{ fontSize: 18, color: "white" }}>
          Confirm and Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  blackBox: {
    height: 120,
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 50,
  },
  commodityContainer: {
    flexDirection: "row",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 5,
  },
  inputGroup: {
    flex: 1,
    position: "relative",
  },
  inputTitle: {
    marginLeft: 20,
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
    marginHorizontal: 20,
    textAlign: "right",
    backgroundColor: "#FFFFFF",
  },
  checked: {
    position: "absolute",
    right: 35,
    bottom: 15,
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
  icon: {
    width:35,
    height:40,
    marginLeft:20,
    marginTop:5

  }
});
