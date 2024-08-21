import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

const NotificationDetailScreen = ({ route }) => {
  const { notification } = route.params;

  const handleMarkAsRead = () => {
    // Add your logic here to mark the notification as read
    Toast.show({
      type: 'success',
      text1: 'Notification Marked as Read',
      position: 'bottom',
      visibilityTime: 2000, // 2 seconds
    });
  };

  // Format the date
  const formattedDate = new Date(notification.created_at).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{notification.title}</Text>
      <Text style={styles.message}>{notification.message}</Text>
      <Text style={styles.date}>Published on: {formattedDate}</Text>
      <TouchableOpacity style={styles.button} onPress={handleMarkAsRead}>
        <Text style={styles.buttonText}>Mark as Read</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#eff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'green',
  },
});

export default NotificationDetailScreen;