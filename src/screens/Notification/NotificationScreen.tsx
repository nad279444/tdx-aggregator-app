import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  RefreshControl,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import NotificationCard from "../../_components/NotificationCard";
import { Ionicons } from '@expo/vector-icons';
export default function NotificationScreen({navigation}) {
  useEffect(() => {
    navigation.setOptions({
      title: 'Notifications',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginRight: 16 }}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const notifications = [
    {
      id: 1,
      title: "Price Change Update",
      description: "There has been a price change update in Walewale",
    },
    {
      id: 2,
      title: "New Product Launch",
      description: "A new product has been launched in the North Region.",
    },
    {
      id: 3,
      title: "System Maintenance",
      description: "Scheduled maintenance will occur on the system tonight from 11 PM to 1 AM.",
    },
    {
      id: 4,
      title: "Event Reminder",
      description: "Don't forget the upcoming agricultural conference on September 10th.",
    },
    {
      id: 5,
      title: "Service Interruption",
      description: "There will be a temporary service interruption in the Western Region from 6 AM to 8 AM tomorrow.",
    },
  ];
  
  return (
    <View>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationCard title={item.title} description={item.description}/>}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
