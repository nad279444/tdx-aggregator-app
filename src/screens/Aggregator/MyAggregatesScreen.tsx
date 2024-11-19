import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import AggregateBarChart from '../../_components/BarChart'; 
import Aggregates from '../../_components/Aggregates';
import AggregatesCard from '../../_components/AggregatesCard';
import { orderstats } from '../../controllers/api/orders';
import NetInfo from '@react-native-community/netinfo';

export default function MyAggregatesScreen({ navigation }) {
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [activeTab, setActiveTab] = useState('progress');
  const [activeChart, setActiveChart] = useState('monthly');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline,setIsOnline] = useState(false)
  

  useEffect(() => {
    navigation.setOptions({
      title: 'My Aggregates',
      headerTitleAlign: 'center',
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
            const localData = await orderstats.loadJsonFromFile();
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
                await orderstats.fetchAndSync();
                const localData = await orderstats.loadJsonFromFile();
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
  
  const handleToggle = (tab) => {
    setActiveTab(tab);
  };

  const handleChartToggle = (chart) => {
    setActiveChart(chart);
    switch (chart) {
      case 'weekly':
        setChartData(weeklyData);
        break;
      case 'monthly':
        setChartData(monthlyData);
        break;
      case 'yearly':
        setChartData(yearlyData);
        break;
      default:
        setChartData(monthlyData);
        break;
    }
  };
  
  const labels = chartData?.map((item) => item.day || item.month || item.year);
  const revenueData = monthlyData?.map((item) => parseFloat(item.revenue));
  
 
   // Calculate total revenue
   const totalAggregates = revenueData?.reduce((acc, val) => acc + val, 0);
   
  // Calculate monthly average
  const monthlyAverage = totalAggregates / monthlyData.length;

  // Find highest and lowest aggregates
  const highestAggregate = Math.max(...revenueData);
  const lowestAggregate = Math.min(...revenueData)

  // Get corresponding months for highest and lowest aggregates
  let highestMonth = '';
  let lowestMonth = '';
  for (let i = 0; i < monthlyData.length; i++) {
    if (revenueData[i] === highestAggregate) {
      highestMonth = monthlyData[i].month;
    }
    if (revenueData[i] === lowestAggregate) {
      lowestMonth = monthlyData[i].month;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.toggleParent}>
        <TouchableOpacity
          style={styles.toggleChild}
          onPress={() => handleToggle('progress')}
        >
          <Ionicons name="bar-chart" size={24} solid />
          <Text> Progress </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toggleChild}
          onPress={() => handleToggle('aggregates')}
        >
          <FontAwesome6 name="sack-dollar" size={24} solid />
          <Text> Aggregates </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dividerContainer}>
        {activeTab === 'progress' && <View style={styles.divider} />}
        {activeTab === 'aggregates' && <View style={[styles.divider, { marginLeft: '50%' }]} />}
      </View>

      {/* Chart Toggle Buttons */}
      {activeTab === 'progress' && (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.button,
              activeChart === 'weekly' && styles.selectedButton,
            ]}
            onPress={() => handleChartToggle('weekly')}
          >
            <Text style={{ color: activeChart === "weekly" ? "white" : "black" }}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              activeChart === 'monthly' && styles.selectedButton,
            ]}
            onPress={() => handleChartToggle('monthly')}
          >
            <Text style={{ color: activeChart === "monthly" ? "white" : "black" }}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              activeChart === 'yearly' && styles.selectedButton,
            ]}
            onPress={() => handleChartToggle('yearly')}
          >
            <Text style={{ color: activeChart === "yearly" ? "white" : "black" }}>Yearly</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'progress' && (
        <>
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="green" />
            </View>
          ) : (
            <>
              <AggregateBarChart data={chartData} labels={labels} dataKey='revenue' />
              <View style={{flexDirection:'row',marginHorizontal:15,flexWrap:'wrap',gap:20}}>
                <AggregatesCard
                  title="Total Aggregates"
                  body={`₵${totalAggregates.toFixed(2)}`}
                  end="1 Jan - 31 Dec"
                />
                <AggregatesCard
                  title="Monthly Average"
                  body={`₵${monthlyAverage.toFixed(2)}`}
                  end="1 Jan - 31 Dec"
                />
                <AggregatesCard
                  title="Highest Aggregates"
                  body={highestMonth}
                  end={`₵${highestAggregate.toFixed(2)}`}
                />
                <AggregatesCard
                  title="Lowest Aggregates"
                  body={lowestMonth}
                  end={`₵${lowestAggregate.toFixed(2)} `}
                />
              </View>
            </>
          )}
        </>
      )}
      
      {activeTab === 'aggregates' && <Aggregates />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  toggleParent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  toggleChild: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dividerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  divider: {
    height: 2,
    backgroundColor: 'green',
    width: '50%',
  },
  chartToggleParent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  chartToggleChild: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
  activeChart: {
    backgroundColor: '#ddd',
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
    alignItems: "center", // Center text horizontally
  },
  selectedButton: {
    backgroundColor: "green",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
