import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import BarChart from "./BarChart";

export default function Progress() {
  const [selectedButton, setSelectedButton] = useState(null);
 

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

  return (
    <View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === "Weekly" && styles.selectedButton,
          ]}
          onPress={() => handleButtonClick("Weekly")}
        >
          <Text style={{ color: selectedButton === "Weekly" ? "white" : "black" }}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === "Monthly" && styles.selectedButton,
          ]}
          onPress={() => handleButtonClick("Monthly")}
        >
          <Text style={{ color: selectedButton === "Monthly" ? "white" : "black" }}>
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === "Yearly" && styles.selectedButton,
          ]}
          onPress={() => handleButtonClick("Yearly")}
        >
          <Text style={{ color: selectedButton === "Yearly" ? "white" : "black" }}>
            Yearly
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{width:'100%',alignItems:'center',marginVertical:40}}>
      <BarChart/>
      </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 2,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#ddd",
    width: "31%",
    alignItems: "center", // Center text horizontally
  },
  selectedButton: {
    backgroundColor: "green",
  },
});
