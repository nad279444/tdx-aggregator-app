import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import AggregateBarChart from '../../_components/BarChart'; 
import Aggregates from '../../_components/Aggregates';
import AggregatesCard from '../../_components/AggregatesCard';

const weeklyData = [
  { day: 'Mon', revenue: 30 },
  { day: 'Tue', revenue: 40 },
  { day: 'Wed', revenue: 35 },
  { day: 'Thu', revenue: 50 },
  { day: 'Fri', revenue: 60 },
  { day: 'Sat', revenue: 70 },
  { day: 'Sun', revenue: 55 },
];

const monthlyData = [
  { month: 'Jan', revenue: 50 },
  { month: 'Feb', revenue: 80 },
  { month: 'Mar', revenue: 40 },
  { month: 'Apr', revenue: 60 },
  { month: 'May', revenue: 90 },
  { month: 'Jun', revenue: 70 },
  { month: 'Jul', revenue: 100 },
  { month: 'Aug', revenue: 55 },
  { month: 'Sep', revenue: 85 },
  { month: 'Oct', revenue: 95 },
  { month: 'Nov', revenue: 75 },
  { month: 'Dec', revenue: 110 },
];

const yearlyData = [
  { year: '2014', revenue: 500 },
  { year: '2015', revenue: 600 },
  { year: '2016', revenue: 700 },
  { year: '2017', revenue: 800 },
  { year: '2018', revenue: 900 },
  { year: '2019', revenue: 1000 },
  { year: '2020', revenue: 1100 },
  { year: '2021', revenue: 1200 },
  { year: '2022', revenue: 1300 },
  { year: '2023', revenue: 1400 },
];

export default function MyAggregatesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('progress');
  const [activeChart, setActiveChart] = useState('monthly');
  const [chartData, setChartData] = useState(monthlyData);

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

  const labels = chartData.map((item) => item.day || item.month || item.year);

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
        <AggregateBarChart data={chartData} labels={labels} />
        <View style={{flexDirection:'row',marginHorizontal:15,flexWrap:'wrap',gap:20}}>
        <AggregatesCard title="Total Aggregates" body="1,620,224 ₵" end="1 feb - 31st August"/>
        <AggregatesCard title="Total Aggregates" body="1,620,224 ₵" end="1 feb - 31st August"/>
        <AggregatesCard title="Total Aggregates" body="1,620,224 ₵" end="1 feb - 31st August"/>
        <AggregatesCard title="Total Aggregates" body="1,620,224 ₵" end="1 feb - 31st August"/>
      </View>
      </>
      )}
      
       {activeTab === 'aggregates' && (
        <Aggregates/>
      )}
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
});
