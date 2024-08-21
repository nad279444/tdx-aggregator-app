import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';

const CommodityDisplayScreen = ({ route, navigation }) => {
  const { item } = route.params;
  console.log(item);

  const handleCommodityPress = () => {
    navigation.navigate('FarmerSelectionScreen', {
      assignment_id: 0,
      item_id: item.id,
      item_name: item.name,
      item_price: item.selling_price,
      item_quantity: item.quantity,
      price_per_kg: item.price_per_kg,
      unit_type: item.unit_type,
      aggregation_fee: item.aggregation_fee
    });
  };



  const handlePriceTablePress = () => {
    navigation.navigate('PriceTableScreen', {
      assignment_id: 0,
      item_id: item.id,
      item_name: item.name,
      item_price: item.selling_price,
      item_quantity: item.quantity,
      price_per_kg: item.price_per_kg,
      unit_type: item.unit_type,
      aggregation_fee: item.aggregation_fee
    });
  };

  const  handleAvailableOfferPress = () => {
    // navigation.navigate('StarScreen');
  };

  const formatDate = (dateString) => {
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formattedDate;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <View style={styles.container}>
      {item.image ? (
        <Image source={{ uri: "https://platform.tdxapp.ai/assets/images/commodities/" + item.image }} style={styles.image} />
      ) : (
        <View style={styles.image}></View>
      )}
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastUpdated}>Today's Prices </Text>
        <Text style={styles.price}>{formatPrice(item.selling_price)}</Text>
        <Text style={styles.lastUpdated}>Last Updated </Text>
        <Text style={styles.dataValue}>{formatDate(item.updated_at)}</Text>
      <View style={{marginTop:20}}>
      <Text style={[styles.buttonTextX, styles.communityPriceButtonText]}>Available Offers </Text>
      <Divider style={{marginBottom:5,marginTop:5}}></Divider>
      <Text style={{fontWeight:'bold',fontSize:20}}> {item.quantity} (100kg)Bags </Text>
      </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.communityPriceButton]} onPress={handleAvailableOfferPress}>
       </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.sellNowButton]} onPress={handleCommodityPress}>
          <Text style={styles.buttonText}>Sell to TDX</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    marginBottom: 20,
    borderColor: "#eee"
  },
  detailsContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
    width: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
    textTransform: 'capitalize'
  },
  price: {
    fontSize: 30,
    color: '#000',
    marginTop:15,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
    marginHorizontal: 0,
    width: '100%',
  },
  lastUpdated: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
    width: '100%',
  },
  dataValue: {
    fontSize: 16,
    color: '#000',
    textAlign: 'left',
    width: '100%',
    fontWeight: 'bold',
    marginTop: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 0,
  },
  button: {
    width: 160,
    paddingVertical: 12,
    borderRadius: 14,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  communityPriceButton: {
    // backgroundColor: '#eff',
  },
  communityPriceButtonText: {
    color: 'green',
  },
  sellNowButton: {
    backgroundColor: 'green',
  },
  buttonTextX: {
    fontWeight: 'bold',
    // textAlign: 'center',
    fontSize: 16,
    color:'#fff'
  },

  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    color:'#fff'
  },
});

export default CommodityDisplayScreen;
