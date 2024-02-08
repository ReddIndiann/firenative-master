import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { getDocs, collection } from 'firebase/firestore';

const TransactionItem = ({ item }) => {
  const dateStr = item.timestamp?.toDate ? item.timestamp.toDate().toLocaleDateString() : 'No date';
  const isCompleted = item.completed;
  
  return (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemDate}>{dateStr}</Text>
        <Text style={styles.itemTitle}>{item.BreadType} - {item.Size}</Text>
        <Text style={styles.itemSubtitle}>Quantity: {item.purchaseQuantity}</Text>
      </View>
      <View style={styles.itemStatus}>
        {isCompleted ? (
          <Text style={styles.statusCompleted}>Completed</Text>
        ) : (
          <Text style={styles.statusPending}>Pending</Text>
        )}
        <Text style={styles.itemAmount}>${item.amount}</Text>
      </View>
    </TouchableOpacity>
  );
};

const History = () => {
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'transactions'));
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
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>
      <FlatList
        data={transactionData}
        renderItem={({ item }) => <TransactionItem item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
    backgroundColor: '#f3f3f3',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemDetails: {
    flex: 2,
  },
  itemStatus: {
    flex: 1,
    alignItems: 'flex-end',
  },
  itemDate: {
    fontSize: 14,
    color: '#757575',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusCompleted: {
    color: 'green',
    fontSize: 16,
    marginBottom: 5,
  },
  statusPending: {
    color: 'red',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default History;
