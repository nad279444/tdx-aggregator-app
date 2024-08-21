import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Divider } from 'react-native-elements';
import AuthTokenStore from '../../../AuthTokenStore';
import AggregatorAssignedItemController from '../../controllers/api/AggregatorAssignedItemController';

const AssignmentDetailScreen = ({ route,navigation }) => {
  const [item, setAssignedItems] = useState([]);
  const { assignment_id, assignment_assigned_date, assignment_expected_fulfillment_date, completionPercentage, daysLeft } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: 'Order Overview' });
    fetchAggregatorAssignedItem();
  }, []); // Fetch assignments whenever activeTab changes

  const fetchAggregatorAssignedItem = async () => {
    try {
      let assignedItemData;
      
        let user_id = await AuthTokenStore.getUserID();
        assignedItemData = await AggregatorAssignedItemController.index(assignment_id);
      
      if (assignedItemData) {
        console.log("assigned Items View: ",assignedItemData.data.data);
        setAssignedItems(assignedItemData.data.data);
      } else {
        setAssignedItems([]);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleCommodityPress = (item_id,item_name,item_price,item_quantity,price_per_kg) => {
    navigation.navigate('FarmerSelectionScreen', {item_id,item_name,item_price,item_quantity,price_per_kg,assignment_id});
  };

  return (
    <ScrollView style={styles.mainctnr}>
    <View style={styles.container}>
      <View style={styles.notificationContentX}>
        <Text style={styles.notificationText}>Order Request: REF# {assignment_id}</Text>
        <Text style={styles.notificationDate}>Assigned: {assignment_assigned_date}</Text>
        <Text style={styles.notificationDate}>Job Time : {assignment_expected_fulfillment_date}</Text>
        <Text style={styles.daysLeft}>Days Left: {daysLeft}</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${completionPercentage}%` }]} />
        </View>
      </View>
      <Divider  style={styles.dividerStyle} />
      <Text> Commodities </Text>
      <Divider  style={styles.dividerStyle} />
      {item.map((data, index) => (
        <CommodityCard key={index} item={data} handleCommodityPress={handleCommodityPress} />
      ))}
      </View>
    </ScrollView>
  );
};

const CommodityCard = ({item, handleCommodityPress }) => {
  const currentDate = new Date().getTime();
  const assignedDate = new Date(item.assigned_date).getTime();
  const expectedFulfillmentDate = new Date(item.expected_fulfillment_date).getTime();
  const totalDays = Math.ceil((expectedFulfillmentDate - assignedDate) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.ceil((expectedFulfillmentDate - currentDate) / (1000 * 60 * 60 * 24));
  const completionPercentage = ((totalDays - daysLeft) / totalDays) * 100;

  return (
    <TouchableOpacity onPress={() => handleCommodityPress(item.id,item.name,item.price,item.quantity,item.price_per_kg)} style={styles.notification}>
      <FontAwesome5 name="boxes" size={20} style={{borderRadius:30,padding:9,height:45,width:45,backgroundColor:"#eff",marginRight:15}} color="green" />
      <View style={styles.notificationContent}>
        {/* <Text style={styles.notificationText}>Commodity: REF# {item.id}</Text> */}
        <Text style={styles.notificationText} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
        <Text style={styles.notificationDate}>Price/Bag Ghc: {item.price}</Text>
        <Text style={styles.notificationDate}>Quantity : {item.quantity} Bag{(item.quantity)>1? 's':''} </Text>
        <Text style={styles.notificationDate}>Price per Kg: {item.price_per_kg}</Text>
        <Text style={styles.notificationDate}>Aggregation Fee Ghc: {item.aggregation_fee==null? "0.00":item.aggregation_fee }</Text>
        <Text style={styles.notificationDate}>Loading Fee Ghc: {item.loading_fee==null? "0.00":item.loading_fee }</Text>
        {/* <Text style={styles.daysLeft}>Days Left: {daysLeft}</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${completionPercentage}%` }]} />
        </View> */}
        {/* <View style={styles.progressTextContainer}>
        <Text style={styles.progressText}>Today: {currentDate} </Text>
        <Text style={styles.progressText}>Days Left: {daysLeft}</Text>
        </View> */}
      </View>
      <View>
        <Text>  </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainctnr:{
    backgroundColor:"#fff",
    padding:10,
  },
  container: {
    flex: 1,
    // backgroundColor: '#f0f0f0',
    // backgroundColor: '#fff',
    paddingHorizontal: 0,
    paddingTop: 10,
    borderBottomColor:"green",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 16,
    color: 'blue',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor:"#fff",
  },
  dividerStyle:{
    marginTop:30,
    marginBottom:30, 
  },
  tabButton: {
    flexDirection: 'row',
    marginRight: 20,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 18,
    color: 'black',
    marginLeft: 5,
  },
  activeTab: {
    color: 'blue',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 24,
    marginBottom: 10,
  },
  notification: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 1,
  },
  notificationContentX: {
    marginLeft: 10,
    flex: 1,
    padding:10,
    backgroundColor:"#eff",
  },
  notificationContent: {
    marginLeft:7,
    flex: 1,
    
  },
  notificationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationDate: {
    fontSize: 14,
    color: 'gray',
  },
  daysLeft: {
    fontSize: 14,
    color: 'blue',
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 5,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  progressText: {
    fontSize: 12,
    color: 'gray',
  },
});

export default AssignmentDetailScreen;