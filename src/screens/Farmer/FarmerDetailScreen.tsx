import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function FarmerDetailScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerified,setIsVerified] = useState(true)
  
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
  return (
    <View style={styles.container}>
      <View style={styles.blackBox}>
        <View style={styles.commodityContainer}>
          <Image
            source={require("../../../assets/Maize.jpg")}
            style={styles.commodityImage}
          />
          <View style={{ marginLeft: 20 }}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
              Yellow Maize
            </Text>
            <Text style={{ color: "#94E081", fontSize: 14, fontWeight: "500" }}>
              24 bags, 2400KG
            </Text>
          </View>
        </View>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
          64,000 ₵
        </Text>
      </View>
      <View style={{ marginLeft: 20, marginTop: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Enter Farmer Details
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter Full Name"
            onChangeText={(text) => setName(text)}
          />
          {isVerified &&  <Ionicons
            name="checkmark-outline"
            size={20}
            color="#21893E"
            style={styles.checked}
          />}
          
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Phone Number</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter Your Phone Number"
            onChangeText={(text) => setPhoneNumber(text)}
            keyboardType="numeric"
          />
          {isVerified &&  <Ionicons
            name="checkmark-outline"
            size={20}
            color="#21893E"
            style={styles.checked}
          />}
         
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
       { isVerified ? <Text style={{ color: "green" }}>Farmer details verified</Text> : <Text style={{ color: "red" }}>Farmer could not be found</Text> }
      </View>
      <TouchableOpacity
        style={isVerified?styles.greenButton:styles.disabledButton}
        onPress={() => navigation.navigate("")}
        disabled={!isVerified}
        
      >
        <Text style={{ fontSize: 18, color:  "white"  }}>
          Continue
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
  commodityImage: {
    marginLeft: 20,
    marginTop: 5,
    width: 35,
    height: 40,
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
});
