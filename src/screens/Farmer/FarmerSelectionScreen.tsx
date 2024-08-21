import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Avatar, Button } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import FarmerController from '../../controllers/api/FarmerContoller';
import AuthTokenStore from '../../../AuthTokenStore';

const FarmerSelectionScreen = ({ route, navigation }) => {
  const { assignment_id, item_id, item_name, item_price, item_quantity, price_per_kg } = route.params;
  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmptyState, setShowEmptyState] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({ title: 'Select Farmer' });
      fetchFarmers();
    }, [page])
  );

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const userID = await AuthTokenStore.getUserID();
      const data = await FarmerController.specify(page, userID);
      if (data) {
        if (page === 1) {
          setFarmers(data.data.data);
          setFilteredFarmers(data.data.data);
        } else {
          setFarmers(prevFarmers => [...prevFarmers, ...data.data.data]);
          setFilteredFarmers(prevFarmers => [...prevFarmers, ...data.data.data]);
        }
        setHasMore(data.data.next_page_url !== null);
        setShowEmptyState(data.data.data.length === 0);
      } else {
        console.error('Error fetching farmers: No data received');
      }
    } catch (error) {
      console.error('Error fetching farmers:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchFarmers();
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filteredData = farmers.filter((farmer) =>
      farmer.first_name.toLowerCase().includes(text.toLowerCase()) ||
      farmer.last_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFarmers(filteredData);
  };

  const handleFarmerSelect = (farmer) => {
    let commodity = { item_id: item_id, item_name: item_name, item_price: item_price, item_quantity: item_quantity, price_per_kg: price_per_kg };
    navigation.navigate('CalculationScreen', { farmerData: farmer, commodityData: commodity, assignmentId: assignment_id });
  };

  const renderAvatar = (item) => {
    if (item.profile_photo_path) {
      return <Avatar rounded source={{ uri: item.profile_photo_path }} size="medium" containerStyle={styles.avatar} />;
    } else {
      const initials = `${item.first_name.charAt(0)}${item.last_name.charAt(0)}`;
      return (
        <Avatar
          rounded
          title={initials}
          size="medium"
          containerStyle={[styles.avatar, { backgroundColor: 'green' }]}
          titleStyle={{ color: 'white', fontSize: 20, textTransform: "uppercase" }}
        />
      );
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleFarmerSelect(item)}>
      <View style={styles.notificationContent}>
        <View style={styles.leftContent}>
          {renderAvatar(item)}
          <View style={styles.textContainer}>
            <Text style={styles.notificationText}>{item.first_name} {item.last_name}</Text>
            <Text style={styles.farmerInfo}>Community: <Text style={{ color: '#000' }}>{item.community}</Text> </Text>
            <Text style={styles.farmerInfo}>Verification: {(item.verification_status == null) ? <Text style={{ color: '#000' }}>Pending</Text> : <Text style={{ color: 'green' }}>{item.verification_status}</Text>} </Text>
          </View>
        </View>
        <View style={styles.rightContent}>
          <Button title="Select" buttonStyle={styles.selectButton} onPress={() => handleFarmerSelect(item)} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        onChangeText={handleSearch}
        value={searchQuery}
        placeholder="Search for farmer..."
        placeholderTextColor="gray"
      />
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="green" />
      ) : (
        <FlatList
          data={filteredFarmers}
          keyExtractor={(item, index) => item.id.toString() + index.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          onEndReached={() => {
            if (!loading && hasMore) {
              setPage(page + 1);
            }
          }}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={
            showEmptyState ? (
              <View style={styles.emptyState}>
                <FontAwesome5 name="sad-tear" size={50} color="#ccc" />
                <Text style={styles.emptyStateText}>No farmers found.</Text>
              </View>
            ) : null
          }
        />
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('AddFarmerScreen')}>
        <Text style={styles.floatingButtonText}>+ Add Farmer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 0,
    position: 'relative',
  },
  notificationContent: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  avatar: {
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  notificationText: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: "capitalize"
  },
  farmerInfo: {
    fontSize: 14,
    color: 'gray',

  },
  selectButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 30,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  loader: {
    marginTop: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:200
  },
  emptyStateText: {
    marginTop: 10,
    color: '#ccc',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'green',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FarmerSelectionScreen;
