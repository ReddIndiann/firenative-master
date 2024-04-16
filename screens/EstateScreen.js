import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const TransactionItem = ({ item }) => {
  const navigation = useNavigation();
  const dateStr = item.timestamp?.toDate ? item.timestamp.toDate().toLocaleDateString() : 'No date';
  const isCompleted = item.completed;
  const handleView = (Id) => {
    navigation.navigate('estatebuy', { id: Id });
  };

  return (
    <TouchableOpacity onPress={() => handleView(item.id)}>
      <View style={styles.itemContainer}>
        <View style={styles.itemLeft}>
          <Text style={styles.itemTitle}>{item.Name}</Text>
          <Text style={styles.itemSubtitle}>{item.Size}</Text>
          <Text style={styles.itemDate}>{dateStr}</Text>
        </View>
        <View style={styles.itemRight}>
          {isCompleted && <Text style={styles.statusCompleted}>✓</Text>}
          <Text style={styles.itemAmount}>{item.Price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Estate = () => {
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Estate'));
        const transactionsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTransactionData(transactionsList);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    
    fetchTransactions();
  }, []);

  return (
    <FlatList
      data={transactionData}
      renderItem={({ item }) => <TransactionItem item={item} />}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#fff', // Light background for each item
  },
  itemLeft: {
    flex: 1, // Take up available space
  },
  itemRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Dark color for better readability
  },
  itemSubtitle: {
    fontSize: 16,
    color: '#666', // Slightly lighter color for subtitle
  },
  itemDate: {
    fontSize: 14,
    color: '#888', // Even lighter for the date
  },
  itemAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50', // Green color for amount
  },
  statusCompleted: {
    color: '#4CAF50', // Green color
    fontSize: 20, // Bigger size for visibility
    marginRight: 10, // Space between tick and amount
  },
  // Add more styles as needed
});

export default Estate;
