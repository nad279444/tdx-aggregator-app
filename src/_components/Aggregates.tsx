import React from "react";
import { View, StyleSheet, Text, SectionList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "react-native-elements";
import CommodityAggregatesCard from "./CommodityAggregatesCard";

export default function Aggregates() {
  const data = [
    {
      date: "2024-08-28",
      data: [
        {
          id: "1",
          commodityName: "Yellow Maize",
          quantity: "20 bags, 100 KG",
          price: 170000,
          image: require("../../assets/Maize.jpg"),
        },
        {
          id: "2",
          commodityName: "Rice",
          quantity: "15 bags, 75 KG",
          price: 120000,
          image: require("../../assets/GroundNut.jpg"),
        },
      ],
    },
    {
      date: "2024-08-29",
      data: [
        {
          id: "3",
          commodityName: "Soybeans",
          quantity: "10 bags, 50 KG",
          price: 8000,
          image: require("../../assets/Soybean.jpg"),
        },
      ],
    },
  ];

  function totalPrice(arr) {
    return arr.reduce((acc, { price }) => acc + price, 0);
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          All Aggregations
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Filter</Text>
          <Ionicons name="filter" size={24} />
        </View>
      </View>

      <SectionList
        sections={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item,section}) => (
          <CommodityAggregatesCard
            commodityName={item.commodityName}
            quantity={item.quantity}
            price={item.price}
            image={item.image}
            date={section.date}
          />
        )}
        renderSectionHeader={({ section: { date, data } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.groupText}>{date}</Text>
            <Divider style={styles.divider} />
            <Text style={styles.groupText}>{totalPrice(data)} ₵</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  sectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 10,
    marginHorizontal: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginHorizontal: 15,
  },
  divider: {
    height: 2,
    backgroundColor: "black",
    width: "45%",
    marginTop: 10,
    marginHorizontal: 10,
  },
  groupText: {
    color: "grey",
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 20,
  },
});
