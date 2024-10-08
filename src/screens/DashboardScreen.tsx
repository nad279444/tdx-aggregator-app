import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { ProfileContext } from "../../ProfileContext";
import { aggregates } from "../controllers/api/aggregates";

export default function DashboardScreen({ navigation }) {
  const { profile } = useContext(ProfileContext);
  const [agg, setAgg] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Dashboard",
      headerTitleAlign: "center",
      headerLeft: () => {},
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
    (async function dashboardAggregates() {
      setLoading(false);
      try {
        const response = await aggregates.getDashboard();
        console.log(response);
        setAgg(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigation]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : (
        <View style={styles.dashboardContainer}>
          <Text
            style={{ fontSize: 18, fontWeight: "bold" }}
          >
            Hello {profile?.firstname ?? ""}
          </Text>
          <View style={styles.greenCard}>
            <View style={{ padding: 20 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
              >
                Available Balance
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: "white",
                  marginTop: 5,
                }}
              >
                {agg?.account_balance}₵
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 40,
                }}
              >
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => navigation.navigate("ManageFarmersScreen")}
                >
                  <Ionicons name="add" size={20} color="white" />
                  <Text style={styles.addButtonText}> Add New Farmer </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <DashboardList
            icon="user-alt"
            button={() => navigation.navigate("ManageFarmersScreen")}
            title="Total Farmers Onboarded"
            content={`${agg?.total_users ?? 0} farmers`}
          />
          <DashboardList
            icon="hand-holding-usd"
            button={() => navigation.navigate("MyAggregatesScreen")}
            title="Total Cash Transmissions"
            content={`${agg?.total_cost ?? 0} ₵ `}
          />
          <DashboardList
            icon="weight"
            button={() => navigation.navigate("CompleteScreen")}
            title="Total Quantities Sold         "
            content={agg?.total_quantity ?? "0 KG" }
          />
        </View>
      )}
       <TouchableOpacity style={styles.greenButton} onPress={() => navigation.navigate('SellToTDXScreen')}>
          <Text style={styles.buttonText2}>Place Order </Text>
        </TouchableOpacity>
    </View>
  );
}

const DashboardList = ({ icon, button, title, content }) => {
  return (
    <View style={styles.listContainer}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 }}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name={icon} size={30} color="black" />
        </View>
        <View style={{ flex: 1, marginLeft: 20 }}>
          <Text style={styles.listTitle}>{title}</Text>
          <Text style={styles.listContent}>{content}</Text>
        </View>
        <TouchableOpacity
          onPress={button}
          style={styles.viewButton}
        >
          <Text style={{ color: "white" }}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  dashboardContainer: {
    margin: 15,
  },
  addButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 140,
    height: 50,
    backgroundColor: "#45A455",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
  },
  greenCard: {
    width: "100%",
    height: 200,
    backgroundColor: "green",
    marginTop: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  listContainer: {
    width: "100%",
    height: 100,
    backgroundColor: "white",
    marginTop: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  listTitle: {
    fontSize: 14,
    
  },
  listContent: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
  },
  viewButton: {
    width: 70,
    height: 30,
    borderRadius: 50,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginBottom:10
  },
  greenButton: {
    backgroundColor: "#21893E",
    marginTop: 25,
    height: 50,
    marginHorizontal: 20,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText2: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
