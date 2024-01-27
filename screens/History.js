import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect,useState } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';
import { doc, getDocs } from 'firebase/firestore'; // Import missing Firestore functions
import { collection } from 'firebase/firestore';


const TransactionItem = ({ item }) => {
  // Check if 'timestamp' exists and is a Firestore Timestamp object
  const dateStr = item.timestamp?.toDate ? item.timestamp.toDate().toLocaleDateString() : 'No date';

  return (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemDate}>{dateStr}</Text>
        <View style={styles.statusIndicator} />  
      </View>
      <Text style={styles.itemTitle}>{item.BreadType}</Text>
      <Text style={styles.itemSubtitle}>{item.Size}</Text>
      <Text style={styles.itemAmount}>{item.purchaseQuantity}</Text>
    </TouchableOpacity>
  );
};

const History = () => {
  const [transactionData, setTransactionData] = useState([]);
  useEffect(() => { // Corrected typo here
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'transactions'));
        const transactionsList = querySnapshot.docs.map(doc => {
          console.log(doc.id, doc.data());  // Add this line to log data
          return {
            id: doc.id,
            ...doc.data()
          };
        });
        setTransactionData(transactionsList);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    
    fetchTransactions(); // Call the async function
  }, []); // Removed auth, db from the dependency array

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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDate: {
    fontSize: 14,
    color: '#757575',
  },
  statusCompleted: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
  },
  statusPending: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  // ... more styles as needed
});

export default History;
