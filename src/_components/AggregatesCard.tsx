import React from "react";
import { Text, View, StyleSheet } from "react-native";

export default function AggregatesCard({ title, body, end }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      <Text style={styles.end}>{end}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  body: {
    fontSize: 24,
    color: "green",
    fontWeight: "500",
  },
  end: {
    fontSize: 12,
  },
});
