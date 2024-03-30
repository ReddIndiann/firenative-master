
import React, { useState, useEffect } from 'react';
import { StyleSheet,Modal, TextInput, Button,TouchableOpacity, View, Alert, SafeAreaView, KeyboardAvoidingView, Text, ScrollView } from 'react-native';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, runTransaction, addDoc } from 'firebase/firestore';
import { SelectList } from 'react-native-dropdown-select-list';

const Payments = () => {
  // ... Existing states and functions ...
  const [BreadType, setBreadType] = useState('');
  const [Size, setSize] = useState('');
  const [purchaseQuantity, setPurchaseQuantity] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState({ status: 'idle', details: null });
  const [modalVisible, setModalVisible] = useState(false);
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
      }, 3000); // Simulates a delay of 9 second
    });
  };
  const handlePreview = () => {
    // Validate selection...
    setModalVisible(true);
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
    setModalVisible(false);
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
    {/* Adjust KeyboardAvoidingView as shown below */}
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust the offset on iOS
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.header}>Purchase Essentials</Text>

          <View style={styles.selectContainer}>
            <Text style={styles.label}>Bread Type</Text>
            <SelectList
              setSelected={setBreadType}
              data={breadTypeOptions}
              placeholder="Select Bread Type"
              boxStyles={styles.selectBox}
              // dropdownStyles removed for brevity
            />
          </View>

          <View style={styles.selectContainer}>
            <Text style={styles.label}>Size</Text>
            <SelectList
              setSelected={setSize}
              data={sizeOptions}
              placeholder="Select Size"
              boxStyles={styles.selectBox}
              // dropdownStyles removed for brevity
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
          <TouchableOpacity onPress={handlePreview} style={styles.button}>
              <Text style={styles.buttonText}>Preview</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
       {/* Modal for previewing the purchase details */}
       <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Confirm Purchase</Text>
            {/* Display selected item details here */}
            <Text style={styles.modalText}>Item: {BreadType}</Text>
            <Text style={styles.modalText}>Size: {Size}</Text>
            <Text style={styles.modalText}>Quantity: {purchaseQuantity}</Text>

            {/* Purchase button within the modal */}
            <Button title="Purchase" onPress={handlePurchase} />

            {/* Optionally, a button to close the modal without purchasing */}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
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
    color: '#003366', // Deep Blue
  },
  selectContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#003366', // Deep Blue
  },
  selectBox: {
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#003366', // Deep Blue
  },
  input: {
    height: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#003366', // Deep Blue
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: "#F2C94C", // Gold
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#003366', // Deep Blue
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default Payments;