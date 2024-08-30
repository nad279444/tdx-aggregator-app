import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

export default function CommodityAggregatesCard({ commodityName, quantity, price,image, date}) {
  const [isPending, setIsPending] = useState(true);
  const navigation = useNavigation();
  function handleNavigation() {
    navigation.navigate('AggregationDetailScreen',{
      commodityName,
      quantity,
     price,
     date 
    });
  }
  
  return (
    <TouchableOpacity style={styles.whiteCard} onPress = {handleNavigation}  >
      <View style={styles.commodityContainer}>
        <Image source={image} style={styles.commodityImage} />
        <View style={{ marginLeft: 20 }}>
          <Text style={{ color: "black", fontSize: 18, fontWeight: "bold" }}>
            {commodityName}
          </Text>
          <Text style={{ color: "#94E081", fontSize: 14, fontWeight: "500" }}>
            {quantity}
          </Text>
        </View>
      </View>
      <Text style={{ color: "black", fontSize: 18, fontWeight: "bold" }}>
        {price} ₵
      </Text>
      <FontAwesome5 name="chevron-right" size={18} />
      {isPending && (
        <View style={styles.pendingContainer}>
          <Text style={{ color: "black", fontSize:12,fontWeight: "bold" }}>Pending</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  whiteCard: {
    height: 90,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    marginVertical: 20,
    position: "relative",
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
  pendingContainer: {
    position: "absolute",
    top: -10, // Adjusted to move the label above the card
    left: '85%', // Centered horizontally
    backgroundColor: "#FFD600",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    zIndex: 10, // Ensure it appears above other elements
  },
});
