import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, TextInput, Button, RefreshControl } from 'react-native';
import FarmerAssignmentController from '../../controllers/api/FarmerAssignmentController';
import AuthTokenStore from '../../../AuthTokenStore';
import { FontAwesome5 } from '@expo/vector-icons';
import { Divider } from 'react-native-elements';

const FarmerAssignmentScreen = ({ farmerId, navigation }) => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterFarmerId, setFilterFarmerId] = useState('');
  const [filterAssignmentId, setFilterAssignmentId] = useState('');
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    navigation.setOptions({ title: 'Bags Aggregated' });
    fetchAssignments();
  }, [farmerId, page]); // Fetch assignments whenever farmerId or page changes

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      setLoading(true);
      const aggregatorId = await AuthTokenStore.getUserID();
      const response = await FarmerAssignmentController.index(aggregatorId, page);
      console.log("data:::",response.data.data);
      if (response && response.data.data) {
        if (page === 1) {
          setAssignments(response.data.data);
        } else {
          setAssignments(prevAssignments => [...prevAssignments, ...response.data.data]);
        }
        setHasMore(response.data.data.length > 0);
      } else {
        setError('Failed to fetch assignments');
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setError('Failed to fetch assignments');
    } finally {
      setIsLoading(false);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleOrderSelect = (order) => {
    navigation.navigate('AggregationDetailScreen', { order });
  };

  const render_FMRID = (farmer_id) => {
    if(farmer_id>10000 && farmer_id<=100000){
        return farmer_id;
    }else if(farmer_id>1000 && farmer_id<=10000){
        return "0"+farmer_id;
    }else if(farmer_id>100 && farmer_id<=1000){
        return "00"+farmer_id;
    }else if(farmer_id>10 && farmer_id<=100){
        return "000"+farmer_id;
    }else if(farmer_id>0 && farmer_id<10){
        return "0000"+farmer_id;
    }
    return farmer_id;
  }

  const handleFilter = () => {
    let filteredAssignments = assignments;
    if (filterFarmerId) {
      filteredAssignments = assignments.filter(item => item.farmer_id === filterFarmerId);
    }
    setAssignments(filteredAssignments);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchAssignments();
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.iconContainer}>
        {/* name="seedling" */}
        <FontAwesome5 name="boxes" style={{fontSize:24,color:"green"}} />
      </View>
      <View style={styles.content}>
        <Text style={styles.filterLabel} numberOfLines={1} ellipsizeMode="tail" >{item.reference_number}</Text>
        <Text> {item.recipient_name} </Text>
        {/* <Text>Total Price: Ghc{item.total_price}</Text>
        <Text>Total Quantity: {item.total_quantity}</Text> */}
        {/* <Text style={{backgroundColor:"#eff",fontWeight:"bold",color:"green",width:120,fontSize:9,padding:5,paddingLeft:15,paddingRight:15,borderRadius:20}}>Farmer ID: TDX{render_FMRID(item.farmer_id)}  </Text> */}
        <Text style={{textTransform:"capitalize"}}>Payment Status: <Text  style={{color:'green'}}> {(item.payment_status ==null)?"pending": item.payment_status } </Text> </Text>
        <Text> {item.payment_date}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => handleOrderSelect(item)} >
        <Text style={styles.buttonText}>Details </Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && page === 1) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        {/* Your filter UI here */}
      </View>
      <Divider />
      <FlatList
        ref={flatListRef}
        data={assignments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    padding:0,
  },
  filterLabel:{
    textTransform:"uppercase",
    marginBottom:5,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop:10
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    width:"100%"
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  iconContainer: {
    backgroundColor: '#eff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  assignmentId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#efff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    width:90,
    height:42,
  },
  buttonText: {
    color: 'green',
    fontWeight: 'bold',
    textAlign:"center",
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default FarmerAssignmentScreen;