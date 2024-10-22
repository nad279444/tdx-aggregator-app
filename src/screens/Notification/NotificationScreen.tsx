import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert, // Import Alert for alerts
} from "react-native";
import NotificationCard from "../../_components/NotificationCard";
import { Ionicons } from "@expo/vector-icons";
import { notifications } from "../../controllers/api/notifications";
import * as Notifications from "expo-notifications";

export default function NotificationScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [notificationResponse, setNotificationResponse] = useState([]);
  console.log(notificationResponse)

  useEffect(() => {
    // Fetch notifications from server
    (async function getNotifications() {
      try {
        setLoading(true);
        const response = await notifications.get();
        setNotificationResponse(response);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Update header options
  useEffect(() => {
    navigation.setOptions({
      title: "Notifications",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="green"
          style={styles.loadingIndicator}
        />
      ) : notificationResponse.length === 0 ? (
        <Text style={styles.noNotificationText}>No notifications yet</Text>
      ) : (
        <FlatList
          data={notificationResponse}
          renderItem={({ item }) => (
            <NotificationCard title={item?.title} description={item?.body} />
          )}
          keyExtractor={(item) => item.id}
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
