import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReceiptScreen = ({ route }) => {
  const { transaction } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Receipt</Text>
      <View style={styles.receiptContainer}>
        <View style={styles.itemContainer}>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.text}>{transaction.id}</Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.text}>{transaction.timestamp?.toDate().toLocaleString()}</Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.label}>Bread Type:</Text>
          <Text style={styles.text}>{transaction.breadType}</Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.label}>Size:</Text>
          <Text style={styles.text}>{transaction.size}</Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.text}>{transaction.quantity}</Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.text}>Ghc{transaction.amount}</Text>
        </View>

     
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 20,
    textAlign: 'center',
    backgroundColor: '#00A5ED',
    color: '#fff',
  },
  receiptContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
  },
  text: {
    fontSize: 16,
    color: '#757575',
  },
  statusCompleted: {
    color: 'green',
  },
  statusPending: {
    color: 'red',
  },
});

export default ReceiptScreen;
