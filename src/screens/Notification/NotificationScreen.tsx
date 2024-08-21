import React, { useState, useEffect } from 'react';
import { View, Text, RefreshControl, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import NotificationController from '../../controllers/api/NotificationController';
import { Feather } from '@expo/vector-icons';

const NotificationScreen = ({ route, navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  navigation.setOptions({
    title: 'Alerts', // Set navigation title
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await NotificationController.index(page);
      console.log(data.data);
      if (data) {
        if (page === 1) {
          setNotifications(data.data);
        } else {
          setNotifications(prevNotifications => [...prevNotifications, ...data.data]);
        }
        setHasMore(data.next_page_url !== null);
      } else {
        console.error('Error fetching notifications: No data received');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = (notification) => {
    navigation.navigate('NotificationDetailScreen', { notification });
  };

  const handleSellToTdxPress = (item) => {
    let data =item.commodity;
    navigation.navigate('FarmerSelectionScreen', {
      assignment_id: 0,
      item_id: data.id,
      item_name: data.name,
      item_price: data.selling_price,
      item_quantity: data.quantity,
      price_per_kg: data.price_per_kg,
      unit_type: data.unit_type,
      aggregation_fee: data.aggregation_fee
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationItemContainer}>
      <TouchableOpacity onPress={() => handleNotificationPress(item)}>
        <View style={styles.notificationItem}>
          <View style={styles.iconContainer}>
            <Feather name="bell" size={20} color="green" />
          </View>
          <View style={styles.notificationContent}>
            <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
            <Text numberOfLines={3} style={styles.message}>{item.message}</Text>
          </View>
          {(item.message_type === "price_update") ? (
            <TouchableOpacity style={styles.sellButton} onPress={() => handleSellToTdxPress(item)}>
              <Text style={styles.sellButtonText}>Sell Now to Tdx</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.detailsButton} onPress={() => handleNotificationPress(item)}>
              <Text style={styles.detailsButtonText}>View Details</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => item.id.toString() + index.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#000']}
          />
        }
        onEndReached={() => {
          if (!loading && hasMore) {
            setPage(page + 1);
          }
        }}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => (
          <ActivityIndicator size="large" color="#000" animating={loading} style={styles.loader} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingTop: 2,
  },
  notificationItemContainer: {
    marginBottom: 10, // Add margin to separate notifications
    borderRadius: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 5,
    elevation: 2,
    padding: 15,
    height:170,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align items and add space between them
  },
  iconContainer: {
    marginRight: 10,
    width: 40,
    height: 40,
    padding: 10,
    backgroundColor: "#eff",
    borderRadius: 20,
  },
  notificationContent: {
    flex: 1,
    marginRight: 10, // Add margin to separate content from buttons
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'green',
  },
  message: {
    fontSize: 14,
    color: '#555',
  },
  arrowContainer: {
    marginLeft: 10,
  },
  loader: {
    marginVertical: 20,
  },
  sellButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    width: 130, // Set specific width
    position: 'absolute',
    top: 100,
    right: 10,
  },
  sellButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  detailsButton: {
    backgroundColor: '#eff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    width: 130, // Set specific width
    position: 'absolute',
    top: 100,
    right: 10,
  },
  detailsButtonText: {
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default NotificationScreen;