import React, { useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, FlatList } from "react-native";
import * as SecureStore from "expo-secure-store"; // Import SecureStore
import { AuthProvider } from "./AuthContext";
import { DataProvider } from "./DBContext";
import { SQLiteProvider } from "expo-sqlite";
import AppNavigator from "./AppNavigator";
import { ProfileDataProvider as AggregatorProfileProvider } from "./ProfileContext";
import { usePushNotifications } from "./src/functions/useNotifications";

export default function App() {
 
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
