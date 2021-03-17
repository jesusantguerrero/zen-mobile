import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';

export default function ZenboardScreen({ navigation }) {
  const [mode, setMode] = useState('zen');

  return (
    <View style={styles.container}>
      <View style={{ flex: 5, justifyContent: "center", alignItems: "center" }}>
        <View style={{ borderRadius: 100, backgroundColor: "red", width: 50, height: 50, justifyContent: "center", alignItems: "center", marginTop: 30 }}>
            <Text style={{ color: "white" }}> { mode } </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity  onPress={() => setMode('zen')} style={styles.button}>
          <Text> Zen </Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => navigation.navigate('Lineup') } style={styles.button}>
          <Text> Lineup </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    height: 20,
    width: "100%"
  },
  button: {
    width: 100,
    minWidth: "48%",
    color: "white",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    fontSize: 36
  },
  header: {
    backgroundColor: "red",
    borderBottomColor: "#333",
    borderBottomWidth: 2,
    height: 40,
    fontSize: 24,
    width: "100%"
  }
});
