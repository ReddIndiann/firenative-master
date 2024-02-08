




import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, TextInput, Button, View, Alert, KeyboardAvoidingView, Text } from 'react-native';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, runTransaction, addDoc } from 'firebase/firestore';
import { SelectList } from 'react-native-dropdown-select-list';

const Payments = () => {
  // ... Existing states and functions ...
  const [BreadType, setBreadType] = useState('');
  const [Size, setSize] = useState('');
  const [purchaseQuantity, setPurchaseQuantity] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState({ status: 'idle', details: null });

  // ... other states and useEffect ...

  const breadTypeOptions = [
    {key: 'SugarBread', value: 'SugarBread'},
    {key: 'ButterBread', value: 'ButterBread'},
    // ... other bread types ...
  ];

  const sizeOptions = [
    {key: 'Small', value: 'Small'},
    {key: 'Large', value: 'Large'},
    // ... other sizes ...
  ];


  const processPayment = () => {
    // Simulate processing time
    return new Promise((resolve) => {
      setTimeout(() => {
        // Randomly determine if the payment is successful or not
        const isSuccess = Math.random() > 0.5; // 50% chance of success or failure
        console.log(`Payment process outcome: ${isSuccess ? 'Success' : 'Failure'}`);
        resolve(isSuccess);
      }, 9000); // Simulates a delay of 9 second
    });
  };

  const handlePurchase = async () => {
    let stockUpdated = false;
    let productRef = null;

    try {
      const q = query(
        collection(db, 'Product'),
        where('Type', '==', BreadType),
        where('Size', '==', Size)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error('No matching product found!');
      }

      const productDoc = querySnapshot.docs[0];
      productRef = productDoc.ref;

      await runTransaction(db, async (transaction) => {
        const freshDoc = await transaction.get(productRef);
        if (!freshDoc.exists()) {
          throw new Error('Product does not exist!');
        }

        const newQuantity = freshDoc.data().quantity - purchaseQuantity;
        if (newQuantity < 0) {
          throw new Error('Insufficient stock!');
        }

        transaction.update(productRef, { quantity: newQuantity });
        stockUpdated = true;
      });

      const paymentSuccessful = await processPayment();
      if (!paymentSuccessful) {
        throw new Error('Payment failed');
      }

      // Payment successful, update transaction status
      setTransactionStatus({
        status: 'completed',
        details: {
          BreadType,
          Size,
          purchaseQuantity,
          timestamp: new Date(),
          userId: auth?.currentUser?.uid
        }
      });

      console.log('Purchase successful');
    } catch (error) {
      console.error('Purchase or payment failed:', error.message);

      if (stockUpdated && productRef) {
        // Restore stock if payment failedd
        await runTransaction(db, async (transaction) => {
          const doc = await transaction.get(productRef);
          if (doc.exists()) {
            const restoredQuantity = doc.data().quantity + purchaseQuantity;
            transaction.update(productRef, { quantity: restoredQuantity });
          }
        });
      }

      setTransactionStatus({ status: 'failed', details: null });
    }
  };

  useEffect(() => {
    if (transactionStatus.status === 'completed' && transactionStatus.details) {
      const saveTransaction = async () => {
        try {
          await addDoc(collection(db, 'transactions'), transactionStatus.details);
          console.log('Transaction details saved successfully');
        } catch (error) {
          console.error('Failed to save transaction details:', error);
        }
      };
      saveTransaction();
    }
  }, [transactionStatus]);

 
  // Updated styles for SelectList
  const selectListStyle = {
    inputIOS: styles.selectInput,
    inputAndroid: styles.selectInput,
    iconContainer: {
      top: 20,
      right: 15,
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
        <Text style={styles.header}>Make a Purchase</Text>

        <View style={styles.selectContainer}>
          <Text style={styles.label}>Bread Type</Text>
          <SelectList
            setSelected={setBreadType}
            data={breadTypeOptions}
            placeholder="Select Bread Type"
            boxStyles={styles.selectBox}
            dropdownStyles={selectListStyle}
          />
        </View>

        <View style={styles.selectContainer}>
          <Text style={styles.label}>Size</Text>
          <SelectList
            setSelected={setSize}
            data={sizeOptions}
            placeholder="Select Size"
            boxStyles={styles.selectBox}
            dropdownStyles={selectListStyle}
          />
        </View>

        <TextInput
          style={styles.input}
          value={String(purchaseQuantity)}
          onChangeText={(value) => setPurchaseQuantity(Number(value))}
          placeholder="Quantity"
          keyboardType="numeric"
        />

        <View style={styles.buttonContainer}>
          <Button title="Purchase" onPress={handlePurchase} color="#5e8b7e" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light background color
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  selectContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectBox: {
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  selectInput: {
    fontSize: 16,
    paddingVertical: 12,
  },
  input: {
    height: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  // Add more styles as needed
});

export default Payments;
