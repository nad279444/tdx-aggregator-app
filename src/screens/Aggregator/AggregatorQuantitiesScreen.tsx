import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AggregateBarChart from "../../_components/BarChart";
import { orderqtystats } from "../../controllers/api/orders";
import AggregatesCard from "../../_components/AggregatesCard";
import NetInfo from '@react-native-community/netinfo';

export default function AggregatorQuantitiesScreen({ navigation }) {
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [activeChart, setActiveChart] = useState("monthly");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline,setIsOnline] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      title: "Aggregator Quantity",
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
    const loadLocalData = async () => {
        try {
            const localData = await orderqtystats.loadJsonFromFile();
            const response = localData.data
          
                setMonthlyData(response.monthly);
                setWeeklyData(response.weekly);
                setYearlyData(response.yearly);
                setChartData(response.monthly); 
  
        } catch (error) {
            console.error("Error loading data from local storage:", error);
        }
    };

    const handleNetworkChange = async (isConnected) => {
        setIsOnline(isConnected);
        if (isConnected) {
            try {
                setLoading(true);
                await orderqtystats.fetchAndSync();
                const localData = await orderqtystats.loadJsonFromFile();
                const response = localData.data
                    setMonthlyData(response.monthly);
                    setWeeklyData(response.weekly);
                    setYearlyData(response.yearly);
                    setChartData(response.monthly); 
            } catch (error) {
                console.error("Error syncing data:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    // Load local data immediately on component mount (offline-first)
    loadLocalData();

    // Listen for network status changes
    const unsubscribe = NetInfo.addEventListener(state => {
        handleNetworkChange(state.isConnected);
    });

    // Clean up the event listener
    return () => unsubscribe();
}, []);

  const handleChartToggle = (chart) => {
    setActiveChart(chart);
    switch (chart) {
      case "weekly":
        setChartData(weeklyData);
        break;
      case "monthly":
        setChartData(monthlyData);
        break;
      case "yearly":
        setChartData(yearlyData);
        break;
      default:
        setChartData(monthlyData);
        break;
    }
  };

  const labels = chartData.map((item) => item.day || item.month || item.year);
  const qtyData = monthlyData.map((item) => parseFloat(item.qty));

  // Calculate total revenue
  const totalAggregates = qtyData.reduce((acc, val) => acc + val, 0);

  // Calculate monthly average
  const monthlyAverage = totalAggregates / monthlyData.length;

  // Find highest and lowest aggregates
  const highestAggregate = Math.max(...qtyData);
  const lowestAggregate = Math.min(...qtyData);

  // Get corresponding months for highest and lowest aggregates
  let highestMonth = "";
  let lowestMonth = "";
  for (let i = 0; i < monthlyData.length; i++) {
    if (qtyData[i] === highestAggregate) {
      highestMonth = monthlyData[i].month;
    }
    if (qtyData[i] === lowestAggregate) {
      lowestMonth = monthlyData[i].month;
    }
  }

  return (
    <View style={styles.container}>
      {/* Chart Toggle Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.button,
            activeChart === "weekly" && styles.selectedButton,
          ]}
          onPress={() => handleChartToggle("weekly")}
        >
          <Text style={{ color: activeChart === "weekly" ? "white" : "black" }}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            activeChart === "monthly" && styles.selectedButton,
          ]}
          onPress={() => handleChartToggle("monthly")}
        >
          <Text
            style={{ color: activeChart === "monthly" ? "white" : "black" }}
          >
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            activeChart === "yearly" && styles.selectedButton,
          ]}
          onPress={() => handleChartToggle("yearly")}
        >
          <Text style={{ color: activeChart === "yearly" ? "white" : "black" }}>
            Yearly
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chart or Loader */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="green" />
        </View>
      ) : (
        <>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 20,
            }}
          >
            <AggregateBarChart data={chartData} labels={labels} dataKey="qty" />
          </View>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 15,
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <AggregatesCard
              title="Total Quantities"
              body={
                totalAggregates >= 100000
                  ? `${(totalAggregates / 1000).toFixed(1)} tonnes`
                  : `${Math.floor(totalAggregates)} kg`
              }
              end="1 Jan - 31 Dec"
            />

            <AggregatesCard
              title="Monthly Average"
              body={
                monthlyAverage >= 100000
                  ? `${(monthlyAverage / 1000).toFixed(1)} tonnes`
                  : `${Math.floor(monthlyAverage)} kg`
              }
              end="1 Jan - 31 Dec"
            />

            <AggregatesCard
              title="Highest Monthly Qty"
              body={highestMonth}
              end={
                highestAggregate >= 100000
                  ? `${(highestAggregate / 1000).toFixed(1)} tonnes`
                  : `${Math.floor(highestAggregate)} kg`
              }
            />

            <AggregatesCard
              title="Lowest Monthly Qty"
              body={lowestMonth}
              end={
                lowestAggregate >= 100000
                  ? `${(lowestAggregate / 1000).toFixed(1)} tonnes`
                  : `${Math.floor(lowestAggregate)} kg`
              }
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
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
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "green",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
