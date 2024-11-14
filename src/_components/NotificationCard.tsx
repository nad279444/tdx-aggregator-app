import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePushNotifications } from '../functions/useNotifications';
import { notifications } from "../controllers/api/notifications";

export default function NotificationCard({ title, description, isRead, id }) {
  const [newMessage, setNewMessage] = useState(!isRead);
  const navigation = useNavigation();
  const { decrementUnreadCount } = usePushNotifications();

  useEffect(() => {
    setNewMessage(!isRead); // Initialize state based on isRead prop
  }, [isRead]);

  const markAsRead = async () => {
    try {
      if (newMessage) {  // Only mark as read if it's unread
        await notifications.post(id); // Send read status to server
        decrementUnreadCount();
        setNewMessage(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to mark notification as read. Please try again.");
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNavigation = async () => {
    await markAsRead();
    navigation.navigate('NotificationDetailScreen', { title, description });
  };

  return (
    <View style={newMessage ? styles.newBackground : styles.background}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {newMessage && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>New</Text>
          </View>
        )}
      </View>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity onPress={handleNavigation}>
        <Text style={styles.readMore}>Read More</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    marginHorizontal: 10,
  },
  newBackground: {
    backgroundColor: '#f0f9f4',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    marginHorizontal: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  newBadge: {
    backgroundColor: '#21893E',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  readMore: {
    fontSize: 14,
    color: '#21893E',
  },
});
