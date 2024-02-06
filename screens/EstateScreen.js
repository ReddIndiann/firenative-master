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
  const isCompleted = item.completed; // This should be a boolean value

  return (
  <TouchableOpacity>
      <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemDate}>{dateStr}</Text>
        <Text style={styles.itemTitle}>{item.BreadType}</Text>
        <Text style={styles.itemSubtitle}>{item.Size}</Text>
        <Text style={styles.itemAmount}>{item.purchaseQuantity}</Text>
      </View>
      <View style={styles.itemRight}>
        {isCompleted && <Text style={styles.statusCompleted}>✓</Text>}
        <Text style={styles.itemAmount}>{item.amount}</Text>
      </View>
    </View>
  </TouchableOpacity>
  );
};

const History = () => {
  const [transactionData, setTransactionData] = useState([]);
  useEffect(() => { // Corrected typo here
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Estate'));
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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center', // Align items vertically
  },
  itemLeft: {
    // Styles for the left container
  },
  itemRight: {
    alignItems: 'flex-end', // Align items to the right
  },
  statusCompleted: {
    // Style your green tick here
    width: 20, // Example size, adjust as needed
    height: 20, // Example size, adjust as needed
    borderRadius: 10, // Half of width/height to make it circular
    backgroundColor: 'green',
    marginBottom: 4, // Space between the tick and the amount
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    // Add more styles for the amount text if needed
  },
  statusCompleted: {
    color: 'green',
    fontSize: 18, // Adjust size as needed
    marginRight: 8, // Adjust spacing as needed
  },
  // ... more styles as needed
});

export default History;
