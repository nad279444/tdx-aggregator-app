import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import PriceController from '../../controllers/api/PriceController';
import { Divider } from 'react-native-paper';

const PriceTableScreen = ({ route, navigation }) => {
  const {assignment_id, item_id, item_name, item_price, item_quantity,price_per_kg } = route.params;
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  const commodity_id   = item_id;
  const commodity_name = item_name;

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      const result = await PriceController.index(item_id,1);
      console.log(result)
      if(result){
        setPrices(result.data);
      }
      setLoading(false);
    };
    fetchPrices();
  }, [commodity_id]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
     
      <Text style={styles.communityName}>{item.community.name}</Text>
      <View style={styles.priceInfoContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.label}>Price</Text>
          <Text style={styles.price}>Ghc{item.current_price_per_bag}</Text>
        </View>
        <View style={styles.updatedContainer}>
          <Text style={styles.label}>Last Updated</Text>
          <Text style={styles.date}>{new Date(item.updated_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}</Text>
        </View>
      </View>
      <View style={styles.actionsContainer}>
        
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <> 
        <Text style={{marginBottom:10}}>Community Prices for {commodity_name} </Text>
        <Divider />
        <FlatList
          data={prices}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  communityName: {
    fontWeight: 'bold',
    color:'green',
    fontSize: 16,
    marginBottom: 8,
  },
  priceInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceContainer: {
    flex: 1,
  },
  updatedContainer: {
    flex: 1,
  },
  label: {
    color: '#888',
  },
  price: {
    fontSize: 16,
  },
  date: {
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PriceTableScreen;