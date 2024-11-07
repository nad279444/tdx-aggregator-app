import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import NotificationCard from "../../_components/NotificationCard";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { notifications } from "../../controllers/api/notifications";
import { usePushNotifications } from "../../functions/useNotifications";

export default function NotificationScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [notificationResponse, setNotificationResponse] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { unreadCount } = usePushNotifications();

  // Fetch read notifications from SecureStore
  const getReadNotifications = async () => {
    const read = await SecureStore.getItemAsync("readNotifications");
    return read ? JSON.parse(read) : [];
  };

  const getNotifications = async () => {
    try {
      setLoading(true);
      const response = await notifications.get();
      const readNotifications = await getReadNotifications();
      const updatedNotifications = response.map((notif) => ({
        ...notif,
        isRead: readNotifications.includes(notif.id),
      }));
      setNotificationResponse(updatedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getNotifications();
    setRefreshing(false);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="green" style={styles.loadingIndicator} />
      ) : notificationResponse.length === 0 ? (
        <Text style={styles.noNotificationText}>No notifications yet</Text>
      ) : (
        <FlatList
          data={notificationResponse}
          renderItem={({ item }) => (
            <NotificationCard title={item?.title} description={item?.body} isRead={item?.isRead} id={item?.id} />
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

