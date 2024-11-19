import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from "react-native";
import NotificationCard from "../../_components/NotificationCard";
import { notifications } from "../../controllers/api/notifications";
import { usePushNotifications } from "../../functions/useNotifications";
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';

export default function NotificationScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [notificationResponse, setNotificationResponse] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { unreadCount } = usePushNotifications();
  const [isOnline,setIsOnline] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      title: 'Notifications',
      headerTitleAlign: 'center',
      headerLeft: () => null,
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginRight: 16 }}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // const getNotifications = async (isRefreshing = false) => {
  //   try {
  //     if (!isRefreshing) setLoading(true);
  //     const response = await notifications.get();
  //     setNotificationResponse(response);
  //   } catch (error) {
  //     console.error("Error fetching notifications:", error);
  //   } finally {
  //     if (isRefreshing) setRefreshing(false);
  //     else setLoading(false);
  //   }
  // };

  ;

  const handleNetworkChange = async (isConnected, isRefreshing = false) => {
    setIsOnline(isConnected);
    if (isConnected) {
        try {
          if (!isRefreshing) setLoading(true);
            await  notifications.fetchAndSync();
            const localData = await notifications.loadJsonFromFile();
            if (localData) {
                setNotificationResponse(localData.data);
            } else {
                console.log("No local data available after sync.");
            }
        } catch (error) {
            console.error("Error syncing data:", error);
        } finally {
          if (isRefreshing) setRefreshing(false);
             else setLoading(false);
        }
    }
};
  useEffect(() => {
    const loadLocalData = async () => {
        try {
            const localData = await notifications.loadJsonFromFile();
            if (localData) {
                setNotificationResponse(localData.data);
            } else {
                console.log("No local data available.");
            }
        } catch (error) {
            console.error("Error loading data from local storage:", error);
        }
    };

    
     handleNetworkChange(isOnline)
    // Load local data immediately on component mount (offline-first)
    loadLocalData();

    // Listen for network status changes
    const unsubscribe = NetInfo.addEventListener(state => {
        handleNetworkChange(state.isConnected);
    });

    // Clean up the event listener
    return () => unsubscribe();
}, []);


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleNetworkChange(isOnline,true);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="green" style={styles.loadingIndicator} />
      ) : notificationResponse.length === 0 ? (
        <Text style={styles.noNotificationText}>No notifications yet</Text>
      ) : (
        <FlatList
          data={notificationResponse}
          renderItem={({ item }) => (
            <NotificationCard
              title={item?.title}
              description={item?.body}
              isRead={item?.isRead}
              id={item?.id}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  noNotificationText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
