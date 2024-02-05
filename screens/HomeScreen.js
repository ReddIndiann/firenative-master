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
// import { SafeAreaView, StyleSheet, TextInput, Button, View, Alert,KeyboardAvoidingView } from 'react-native';
// import { db, auth } from '../firebase';
// import { collection, query, where, getDocs, runTransaction, addDoc } from 'firebase/firestore';
// import { SelectList } from 'react-native-dropdown-select-list';
// import { useState,useEffect } from 'react';
// const Payments = () => {
//   const [BreadType, setBreadType] = useState('');
//   const [Size, setSize] = useState('');
//   const [purchaseQuantity, setPurchaseQuantity] = useState(0);
//   const [transactionStatus, setTransactionStatus] = useState({ status: 'idle', details: null });

//   // ... other states and useEffect ...

//   const breadTypeOptions = [
//     {key: 'SugarBread', value: 'SugarBread'},
//     {key: 'ButterBread', value: 'ButterBread'},
//     // ... other bread types ...
//   ];

//   const sizeOptions = [
//     {key: 'Small', value: 'Small'},
//     {key: 'Large', value: 'Large'},
//     // ... other sizes ...
//   ];


  
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
//       <KeyboardAvoidingView>
//       <SelectList
//         setSelected={setBreadType}
//         data={breadTypeOptions}
//         placeholder="Select Bread Type"
//       />
//       <SelectList
//         setSelected={setSize}
//         data={sizeOptions}
//         placeholder="Select Size"
//       />
//       <TextInput
//         style={styles.input}
//         value={String(purchaseQuantity)}
//         onChangeText={(value) => setPurchaseQuantity(Number(value))}
//         placeholder="Quantity"
//         keyboardType="numeric"
//       />
//       <Button title="Purchase" onPress={handlePurchase} />
//       </KeyboardAvoidingView>
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
//   // Add styles for SelectList if needed
// });

// export default Payments;


import { SafeAreaView, StyleSheet, TextInput, Button, View, Alert,KeyboardAvoidingView } from 'react-native';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, runTransaction, addDoc } from 'firebase/firestore';
import { SelectList } from 'react-native-dropdown-select-list';
import { useState,useEffect } from 'react';
const Payments = () => {
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView>
      <SelectList
        setSelected={setBreadType}
        data={breadTypeOptions}
        placeholder="Select Bread Type"
      />
      <SelectList
        setSelected={setSize}
        data={sizeOptions}
        placeholder="Select Size"
      />
      <TextInput
        style={styles.input}
        value={String(purchaseQuantity)}
        onChangeText={(value) => setPurchaseQuantity(Number(value))}
        placeholder="Quantity"
        keyboardType="numeric"
      />
      <Button title="Purchase" onPress={handlePurchase} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
  },
  // Add styles for SelectList if needed
});

export default Payments;
