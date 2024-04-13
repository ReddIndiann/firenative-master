// import React, { useState, useEffect } from 'react';
// import { SafeAreaView, StyleSheet, TextInput, Button, View, Text, Alert } from 'react-native';
// import { db,auth } from '../firebase';
// import { collection, query, where, getDocs, runTransaction, addDoc } from 'firebase/firestore';

// const Payments = () => {
//   const [BreadType, setBreadType] = useState('');
//   const [Size, setSize] = useState('');
//   const [purchaseQuantity, setPurchaseQuantity] = useState(0);
//   const [transactionStatus, setTransactionStatus] = useState({ status: 'idle', details: null });

//   useEffect(() => {
//     // If a transaction has been completed, save it to the 'transactions' collection
//     if (transactionStatus.status === 'completed' && transactionStatus.details) {

//       const saveTransaction = async () => {
//         try {
//           await addDoc(collection(db, 'transactions'), transactionStatus.details);
//           console.log('Transaction details saved successfully');
//         } catch (error) {
//           console.error('Failed to save transaction details:', error);
//         }
//       };

//       saveTransaction();
//     }
//   }, [transactionStatus]); // Depend on transactionStatus

//   const handlePurchase = async () => {
//     const q = query(
//       collection(db, 'Product'),
//       where('Type', '==', BreadType),
//       where('Size', '==', Size)
//     );

//     try {
//       const querySnapshot = await getDocs(q);
//       if (querySnapshot.empty) {
//         throw new Error('No matching product found!');
//       }

//       const productDoc = querySnapshot.docs[0];
//       const productRef = productDoc.ref;

//       await runTransaction(db, async (transaction) => {
//         const freshDoc = await transaction.get(productRef);
//         if (!freshDoc.exists()) {
//           throw new  Alert.alert('Product does not exist!',);
//           throw new Error('Product does not exist!');

//         }

//         const newQuantity = freshDoc.data().quantity - purchaseQuantity;
//         if (newQuantity < 0) {
//           throw new  Alert.alert('Insuffiecient',);
//           throw new Error('Product does not exist!' );
//         }

//         transaction.update(productRef, { quantity: newQuantity });

//         // Prepare transaction details for saving
//         setTransactionStatus({
//           status: 'completed',
//           details: {
//             BreadType,
//             Size,
//             purchaseQuantity,
//             timestamp: new Date(),
//             userId:auth?.currentUser?.uid
//           }
//         });
//       });
//       Alert.alert('Purchase successful',);
//       console.log('Purchase successful');
//     } catch (error) {
//       console.error('Purchase failed:', error.message);

//       // Update the transaction status to 'failed'
//       setTransactionStatus({ status: 'failed', details: null });
//     }
//   };
//   return (
//     <SafeAreaView style={styles.container}>
//       <TextInput
//         style={styles.input}
//         value={BreadType}
//         onChangeText={setBreadType}
//         placeholder="Bread Type"
//       />
//       <TextInput
//         style={styles.input}
//         value={Size}
//         onChangeText={setSize}
//         placeholder="Size"
//       />
//       <TextInput
//         style={styles.input}
//         value={String(purchaseQuantity)}
//         onChangeText={(value) => setPurchaseQuantity(Number(value))}
//         placeholder="Quantity"
//         keyboardType="numeric"
//       />
//       <Button title="Purchase" onPress={handlePurchase} />
//     </SafeAreaView>
//   );
// };

// // Define your styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//   },
//   input: {
//     height: 40,
//     marginVertical: 12,
//     borderWidth: 1,
//     padding: 10,
//   },
// });

// export default Payments;

// import React, { useState, useEffect } from 'react';
// import { ScrollView, SafeAreaView, StyleSheet, TextInput, Button, View, Text, Alert } from 'react-native';

// import { db,auth } from '../firebase';
// import { collection, query, where, getDocs, runTransaction, addDoc } from 'firebase/firestore';
// import { Picker } from '@react-native-picker/picker';
// import { useNavigation } from '@react-navigation/native';

// const Payments = () => {
//   const [BreadType, setBreadType] = useState('');
//   const [Size, setSize] = useState('');
//   const [purchaseQuantity, setPurchaseQuantity] = useState(0);

// const navigation = useNavigation();
//   const [transactionStatus, setTransactionStatus] = useState({ status: 'idle', details: null });
// function admin(){
//   navigation.navigate("Admin")
// }
//   useEffect(() => {
//     // If a transaction has been completed, save it to the 'transactions' collection
//     if (transactionStatus.status === 'completed' && transactionStatus.details) {

//       const saveTransaction = async () => {
//         try {
//           await addDoc(collection(db, 'transactions'), transactionStatus.details);
//           console.log('Transaction details saved successfully');
//         } catch (error) {
//           console.error('Failed to save transaction details:', error);
//         }
//       };

//       saveTransaction();
//     }
//   }, [transactionStatus]); // Depend on transactionStatus

//   const handlePurchase = async () => {
//     const q = query(
//       collection(db, 'Product'),
//       where('Type', '==', BreadType),
//       where('Size', '==', Size)
//     );

//     try {
//       const querySnapshot = await getDocs(q);
//       if (querySnapshot.empty) {
//         throw new Error('No matching product found!');
//       }

//       const productDoc = querySnapshot.docs[0];
//       const productRef = productDoc.ref;

//       await runTransaction(db, async (transaction) => {
//         const freshDoc = await transaction.get(productRef);
//         if (!freshDoc.exists()) {
//           throw new  Alert.alert('Product does not exist!',);
//           throw new Error('Product does not exist!');

//         }

//         const newQuantity = freshDoc.data().quantity - purchaseQuantity;
//         if (newQuantity < 0) {
//           throw new  Alert.alert('Insuffiecient Stock',);
//           throw new Error('Product does not exist!' );
//         }

//         transaction.update(productRef, { quantity: newQuantity });

//         // Prepare transaction details for saving
//         setTransactionStatus({
//           status: 'completed',
//           details: {
//             BreadType,
//             Size,
//             purchaseQuantity,
//             timestamp: new Date(),
//             userId:auth?.currentUser?.uid
//           }
//         });
//       });
//       Alert.alert('Purchase successful',);
//       console.log('Purchase successful');
//     } catch (error) {
//       console.error('Purchase failed:', error.message);

//       // Update the transaction status to 'failed'
//       setTransactionStatus({ status: 'failed', details: null });
//     }
//   };
//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView style={styles.scrollView}>

//       <View style={styles.pickerContainer}>
//         <Text style={styles.label}>Bread Type</Text>
//         <Picker
//           selectedValue={BreadType}
//           onValueChange={(itemValue, itemIndex) => setBreadType(itemValue)}
//           style={styles.picker}
//           mode="dropdown" // Android only
//         >
//           {/* List your options here */}
//           <Picker.Item label="SugarBread" value="SugarBread" />
//           <Picker.Item label="White" value="white" />

//           {/* ... other options ... */}
//         </Picker>
//       </View>

//       <View style={styles.pickerContainer}>
//         <Text style={styles.label}>Size</Text>
//         <Picker
//           selectedValue={Size}
//           onValueChange={(itemValue, itemIndex) => setSize(itemValue)}
//           style={styles.picker}
//           mode="dropdown" // Android only
//         >
//           <Picker.Item label="Small" value="Small" />

//           <Picker.Item label="Large" value="large" />
//           {/* ... other options ... */}
//         </Picker>
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Quantity</Text>
//         <TextInput
//           style={styles.input}
//           value={purchaseQuantity}
//           onChangeText={(value) => setPurchaseQuantity(value)}
//           placeholder="Quantity"
//           keyboardType="numeric"
//         />
//       </View>

//       <Button title="Purchase" onPress={handlePurchase} color="#5e8b7e" />
//       <Button title="Purchas he" onPress={admin} color="#5e8b7e" />
//       <Button title="Purchase"  color="#5e8b7e" />
//       <Button title="Purchase"  color="#5e8b7e" />
//       <Button title="Purchase"  color="#5e8b7e" />
//       <Button title="Purchase"  color="#5e8b7e" />
//       <Button title="Purchase"  color="#5e8b7e" />
//       <Button title="Purchase"  color="#5e8b7e" />
//       <Button title="Purchase"  color="#5e8b7e" />
//       <Button title="Purchase"  color="#5e8b7e" />
//       <Button title="Purchase"  color="#5e8b7e" />
//       <Button title="Purchase"  color="#5e8b7e" />
//       <Button title="Purchase"  color="#5e8b7e" />
//       <Button title="Purchase"  color="#5e8b7e" />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// // Update your styles for a more professional look
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start', // Align to the top
//     padding: 16,
//     backgroundColor: '#f7f7f7', // Light grey background
//   },
//   pickerContainer: {
//     marginBottom: 20,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     color: '#333', // Dark text for better readability
//     marginBottom: 8,
//   },
//   picker: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     marginBottom: Platform.OS === 'android' ? 0 : 20, // Adjust for platform differences
//   },
//   input: {
//     height: 50,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 16,
//   },
//   scrollView: {
//     flex: 1,
//   },
// });

// export default Payments;import React, { useState, useEffect } from 'react';

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { db, auth } from "../firebase";
import { SelectList } from "react-native-dropdown-select-list";
import {
  collection,
  query,
  where,
  getDocs,
  runTransaction,
  addDoc,
} from "firebase/firestore";

const WaterScreen = () => {
  const [BreadType, setBreadType] = useState("");
  const [Size, setSize] = useState("");
  const [purchaseQuantity, setPurchaseQuantity] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState({
    status: "idle",
    details: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [walletNumber, setWalletNumber] = useState("");
  const [paymentOption, setPaymentOption] = useState("");

  const breadTypeOptions = [
    { key: "WaterBag", value: "WaterBag" },
    { key: "ButterBread", value: "ButterBread" },
    // Add other bread types here
  ];

  const handlePreview = () => {
    // Validate selection...
    setModalVisible(true);
  };

  const paymentOptions = [
    { key: "MTN", value: "MTN" },
    { key: "ButterBread", value: "ButterBread" },
    // ... other payment options ...
  ];

  const sizeOptions = {
    WaterBag: [
      { key: "NormalSachet", value: "NormalSachet" },
      { key: "Small", value: "Small" },
    ],
    WaterBottle: [
      { key: "Big", value: "Big" },
      { key: "Small", value: "Small" },
    ],
    // Add other size options here
  };

  const handlePaymentSubmit = async () => {
    const paymentData = {
      amount: paymentAmount,
      paymentoption: paymentOption,
      walletnumber: walletNumber,
      description: "Payment for water", // Adjust description as needed
    };

    // Handle payment submission
  };

  useEffect(() => {
    if (transactionStatus.status === "completed" && transactionStatus.details) {
      const saveTransaction = async () => {
        try {
          await addDoc(
            collection(db, "transactions"),
            transactionStatus.details
          );
          console.log("Transaction details saved successfully");
        } catch (error) {
          console.error("Failed to save transaction details:", error);
          // Handle error here
        }
      };

      saveTransaction();
    }
  }, [transactionStatus]);

  const handlePurchase = async () => {
    const q = query(
      collection(db, "Product"),
      where("Type", "==", BreadType),
      where("Size", "==", Size)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error("No matching product found!");
      }

      const productDoc = querySnapshot.docs[0];
      const productRef = productDoc.ref;

      await runTransaction(db, async (transaction) => {
        const freshDoc = await transaction.get(productRef);
        if (!freshDoc.exists()) {
          throw new Error("Product does not exist!");
        }

        const newQuantity = freshDoc.data().quantity - purchaseQuantity;
        if (newQuantity < 0) {
          throw new Error("Insufficient stock");
        }

        transaction.update(productRef, { quantity: newQuantity });

        setTransactionStatus({
          status: "completed",
          details: {
            BreadType,
            Size,
            purchaseQuantity,
            timestamp: new Date(),
            userId: auth?.currentUser?.uid,
          },
        });
      });
      Alert.alert("Purchase successful");
    } catch (error) {
      console.error("Purchase failed:", error.message);
      Alert.alert("Purchase failed", error.message);
      setTransactionStatus({ status: "failed", details: null });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust the offset on iOS
      >
        <ScrollView>
          <Text style={styles.header}>Purchase Essentials</Text>

          <View style={styles.selectContainer}>
            <Text style={styles.label}>Bread Type</Text>
            <SelectList
              setSelected={setBreadType}
              data={breadTypeOptions}
              placeholder="Select Water Type"
              boxStyles={styles.selectBox}
            />
          </View>

          <View style={styles.selectContainers}>
            <Text style={styles.label}>Size</Text>

            <SelectList
              setSelected={setSize}
              data={sizeOptions[BreadType]}
              placeholder="Select Size"
              boxStyles={styles.selectBox}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(false);
        }}
      >
        {/* Your modal content here */}
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Confirm Purchase</Text>
            {/* Display selected item details here */}
            <Text style={styles.modalText}>Item: {BreadType}</Text>
            <Text style={styles.modalText}>Size: {Size}</Text>
            <Text style={styles.modalText}>Quantity: {purchaseQuantity}</Text>
            {/* Payment inputs */}
            <Text style={styles.label}>Total Amount</Text>
            <TextInput
              style={styles.input}
              value={paymentAmount}
              onChangeText={setPaymentAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
            />
            <Text style={styles.label}>Wallet Number</Text>
            <TextInput
              style={styles.input}
              value={walletNumber}
              onChangeText={setWalletNumber}
              placeholder="Enter wallet number"
            />
            <Text style={styles.label}>Payment Option</Text>

            <SelectList
              setSelected={setPaymentOption}
              data={paymentOptions}
              placeholder="Select Size"
              boxStyles={styles.selectBox}
            />
            {/* Purchase button */}
            <Button title="Purchase" onPress={handlePaymentSubmit} />

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
    backgroundColor: "white",
    padding: 20,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#003366",
    marginTop: 0,
  },
  selectContainer: {
    marginBottom: 20,
    marginTop: 50,
  },
  selectContainers: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#003366",
  },
  input: {
    height: 50,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#003366",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  selectBox: {
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#003366",
  },
  button: {
    backgroundColor: "#00A5ED",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default WaterScreen;
