import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTaskFirestore } from "../../utils/useTaskFirestore";

export default function ZenboardScreen({ navigation, extraData }) {
  const [mode, setMode] = useState('zen');

  const [ todo, setTodo ] = useState([])
  const { getTaskByMatrix } = useTaskFirestore(extraData)

  
  const getMatrix = (matrix: string, callback) => {
      getTaskByMatrix(matrix).then((collectionRef) => {
      const unsubscribe = collectionRef.onSnapshot((snap) => {
        const results = [];
        snap.forEach((doc) => {
          results.push({ ...doc.data(), uid: doc.id });
        });
        callback(results)
      });
  
      return unsubscribe;
    });
  };

  useEffect(() => { 
      const todoRef = getMatrix("todo", setTodo);
  }, [])

  return (
    <View style={styles.container}>
      <View style={{ flex: 5, justifyContent: "center", alignItems: "center" }}>
        <View style={{ borderRadius: 100, backgroundColor: "red", width: 50, height: 50, justifyContent: "center", alignItems: "center", marginTop: 30 }}>
            <Text style={{ color: "white" }}> Metrics </Text>
        </View>
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
