import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SectionList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "react-native-elements";
import CommodityAggregatesCard from "./CommodityAggregatesCard";
import { aggregates } from "../controllers/api/aggregates";

export default function Aggregates() {
  const [aggregationData, setAggregationData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function getAggregates() {
      try {
        setLoading(true);
        const response = await aggregates.get();
        console.log(response);
        setAggregationData(response);
      } catch (error) {
        console.error("Error fetching community rates:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      {loading ? (
        <ActivityIndicator color='green' size='large' style={styles.loader}/>
      ) : (
        <SectionList
          sections={aggregationData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, section }) => (
            <CommodityAggregatesCard
              commodityName={item.commodityName}
              quantity={item.quantity}
              price={item.price}
              image={item.image}
              bags={item.bags}
              farmer={item.farmer}
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
      )}
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
