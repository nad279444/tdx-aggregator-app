import React, { useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, FlatList } from "react-native";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store"; // Import SecureStore
import { AuthProvider } from "./AuthContext";
import { DataProvider } from "./DBContext";
import { SQLiteProvider } from "expo-sqlite";
import AppNavigator from "./AppNavigator";
import NotificationCard from "./src/_components/NotificationCard";
import { LogLevel, OneSignal } from "react-native-onesignal";
import Constants from "expo-constants";
import { ProfileDataProvider as AggregatorProfileProvider } from "./ProfileContext";
import { sendDeviceToken } from "./src/controllers/user/deviceID";

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const [deviceToken, setDeviceToken] = useState(null);

  useEffect(() => {
    // Set log level for debugging
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    // Initialize OneSignal with the App ID
    const oneSignalAppId = Constants.expoConfig.extra.oneSignalAppId;
    OneSignal.initialize(oneSignalAppId);

    // Request for notification permissions
    OneSignal.Notifications.requestPermission(true);

    const fetchPlayerId = async () => {
      try {
        const playerId = await OneSignal.User.pushSubscription.getIdAsync();
        console.log("OneSignal Player ID:", playerId);
        setDeviceToken(playerId);

        // Save the Player ID in SecureStorage
        await storeDeviceToken(playerId);
      } catch (error) {
        console.error("Error getting Player ID:", error);
      }
    };

    fetchPlayerId();

    // Listen for notifications
    OneSignal.Notifications.addEventListener("received", onReceived);
    OneSignal.Notifications.addEventListener("opened", onOpened);

    return () => {
      // Clean up listeners
      OneSignal.Notifications.removeEventListener("received", onReceived);
      OneSignal.Notifications.removeEventListener("opened", onOpened);
    };
  }, []);

  const onReceived = (notification) => {
    console.log("Notification received:", notification);
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      {
        id: notification.notificationId,
        title: notification.title,
        body: notification.body,
      },
    ]);
  };

  const onOpened = (openResult) => {
    console.log("Notification opened:", openResult);
  };

  // Function to store the device token securely
  const storeDeviceToken = async (token) => {
    try {
      await SecureStore.setItemAsync("deviceToken", token);
      console.log("Device token stored securely.");
    } catch (error) {
      console.error("Error storing device token:", error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await sendDeviceToken.sendToken();
        if (!response.error) {
          console.log("Device Token Sent");
        } else {
          console.log("Device Token not Sent");
        }
      } catch (error) {
        console.error(
          "An error occurred while sending the device token:",
          error
        );
      }
    })();
  }, []);

  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <SQLiteProvider databaseName="appData.db">
          <AggregatorProfileProvider>
            <DataProvider>
              <AppNavigator />
            </DataProvider>
          </AggregatorProfileProvider>
        </SQLiteProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
