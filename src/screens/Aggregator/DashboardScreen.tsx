import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import AuthTokenStore from '../../../AuthTokenStore';
import AggregatorController from '../../controllers/api/AggregatorController';

const DashboardScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = ['2023', '2024', '2025'];
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    // Call API initially without filters
    fetchAggregatorAnalytics();
  }, []);

  const fetchAggregatorAnalytics = async () => {
    try {
      const user_id = await AuthTokenStore.getUserID();
      const response = await AggregatorController.getAggregatorAnalytics(user_id,selectedMonth, selectedYear);
      console.log(response.data);
      if (response.status === 200) {
        setAnalyticsData(response.data);
      } else {
        // throw new Error(response.error || 'Failed to fetch aggregator analytics data');
      }
    
    } catch (error) {
      console.error('Error fetching aggregator analytics data:', error);
      setAnalyticsData(null);
    }
  };


  const handleFilterChange = async () => {
    try {
      const token = await AuthTokenStore.getToken(); // Assuming AuthTokenStore handles token retrieval
      const id = await AuthTokenStore.getUserID();
      const response = await fetch(`https://platform.tdxapp.ai/api/v1/aggregator/${id}/analytics?month=${selectedMonth}&year=${selectedYear}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });

      const data = await response.json();
      console.log("Response from API with filters:", data);

      if (response.status === 200 && data.status_code === 200) {
        setAnalyticsData(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch aggregator analytics data');
      }
    } catch (error) {
      console.error('Error fetching aggregator analytics data with filters:', error);
      setAnalyticsData(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      {analyticsData && (
        <View style={styles.card}>
          <Text style={styles.aggregatorName}>{/* Display aggregator name here */}</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="swap-vertical-outline" size={24} color="green" />
              <Text style={styles.infoNumber}>{analyticsData.total_assignments}</Text>
              <Text style={styles.infoText}>Total Assignments</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="thumbs-up-outline" size={24} color="green" />
              <Text style={styles.infoNumber}>{analyticsData.paid_count}</Text>
              <Text style={styles.infoText}>Paid Assignments</Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="checkmark-circle-outline" size={24} color="green" />
              <Text style={styles.infoNumber}>{analyticsData.pending_count}</Text>
              <Text style={styles.infoText}>Pending Assignments</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="cart-outline" size={24} color="green" />
              <Text style={styles.infoNumber}>{analyticsData.total_bags}</Text>
              <Text style={styles.infoText}>Total Bags</Text>
            </View>
          </View>

          {/* Add more analytics display as needed */}
        </View>
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  aggregatorName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  infoItem: {
    alignItems: 'center',
    backgroundColor: '#eff',
    padding: 15,
    borderRadius: 5,
    width: '45%',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#000',
    marginTop: 6,
    textAlign: 'center',
  },
  infoNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default DashboardScreen;

