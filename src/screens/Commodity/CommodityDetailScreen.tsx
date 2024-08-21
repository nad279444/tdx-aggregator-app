import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import { Divider } from 'react-native-paper';

const CommodityDetailScreen = ({ route }) => {
  const { commodityData } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.title}>Commodity Details</Text> */}

      <View style={styles.detailItem}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{commodityData.name}</Text>
      </View>
      <Divider style={styles.divider} />

      <View style={styles.detailItem}>
        <Text style={styles.label}>Cost Price:</Text>
        <Text style={styles.value}>{commodityData.cost_price}</Text>
      </View>
      <Divider style={styles.divider} />

      <View style={styles.detailItem}>
        <Text style={styles.label}>Selling Price:</Text>
        <Text style={styles.value}>{commodityData.selling_price}</Text>
      </View>
      <Divider style={styles.divider} />

      <View style={styles.detailItem}>
        <Text style={styles.label}>Quantity:</Text>
        <Text style={styles.value}>{commodityData.quantity}</Text>
      </View>
      <Divider style={styles.divider} />

      <View style={styles.detailItem}>
        <Text style={styles.label}>Unit Type:</Text>
        <Text style={styles.value}>{commodityData.unit_type}</Text>
      </View>
      <Divider style={styles.divider} />

      <View style={styles.detailItem}>
        <Text style={styles.label}>Vendor ID:</Text>
        <Text style={styles.value}>{commodityData.vendor_id}</Text>
      </View>
      <Divider style={styles.divider} />

      <View style={styles.detailItem}>
        <Text style={styles.label}>Grade:</Text>
        <Text style={styles.value}>{commodityData.grade}</Text>
      </View>
      <Divider style={styles.divider} />

      <View style={styles.detailItem}>
        <Text style={styles.label}>Source:</Text>
        <Text style={styles.value}>{commodityData.source}</Text>
      </View>
      <Divider style={styles.divider} />

      <View style={styles.detailItem}>
        <Text style={styles.label}>Source Region:</Text>
        <Text style={styles.value}>{commodityData.source_region}</Text>
      </View>
      <Divider style={styles.divider} />

      <View style={styles.detailItem}>
        <Text style={styles.label}>Current Location:</Text>
        <Text style={styles.value}>{commodityData.current_location}</Text>
      </View>
      <Divider style={styles.divider} />

      <View style={styles.detailItem}>
        <Text style={styles.label}>Current Region:</Text>
        <Text style={styles.value}>{commodityData.current_region}</Text>
      </View>
      <Divider style={styles.divider} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor:"#fff",
    padding:14,
    borderRadius:5
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    width: '30%',
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
  divider: {
    backgroundColor: '#ccc',
    height: 1,
    marginBottom: 10,
  },
});

export default CommodityDetailScreen;