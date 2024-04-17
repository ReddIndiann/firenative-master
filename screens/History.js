import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebase';
import { useNavigation } from '@react-navigation/native'; // Import the navigation hook


import { collection, query, where, getDocs, runTransaction, addDoc } from 'firebase/firestore';
const TransactionItem = ({ item, onPress }) => {
  const dateStr = item.timestamp?.toDate ? item.timestamp.toDate().toLocaleDateString() : 'No date';
  const isCompleted = item.completed;
  
  const handlePress = () => {
    onPress(item);
  };

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={handlePress}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemDate}>{dateStr}</Text>
        <Text style={styles.itemTitle}>{item.breadType} - {item.Size}</Text>
        <Text style={styles.itemSubtitle}>Quantity: {item.quantity}</Text>
        <Text style={styles.itemSubtitle}>Amount: {item.amount}</Text>
      </View>
      <View style={styles.itemStatus}>
       
    
      </View>
      <TouchableOpacity style={styles.viewReceiptButton} onPress={handlePress}>
        <Text style={styles.viewReceiptButtonText}>View Receipt</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};


const History = () => {
  const [transactionData, setTransactionData] = useState([]);
  const navigation = useNavigation(); 
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Assuming 'auth' is your Firebase auth instance and it has a current user
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log("No user currently signed in!");
          return;
        }
        
        const q = query(collection(db, 'transactions'), where("userId", "==", currentUser.uid));
        
        const querySnapshot = await getDocs(q);
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
  const handleViewReceipt = (transaction) => {
    navigation.navigate('receipt', { transaction }); // Navigate to Receipt screen with transaction details
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>
      <FlatList
        data={transactionData}
        renderItem={({ item }) => (
          <TransactionItem item={item} onPress={handleViewReceipt} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 20,
    textAlign: 'center',
    backgroundColor: '#f3f3f3',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white', // Alternating background color will be applied
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
  viewReceiptButton: {
    backgroundColor: '#00A5ED',
  
    borderRadius: 5,
  },
  viewReceiptButtonText: {
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default History;
