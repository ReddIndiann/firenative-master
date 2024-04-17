import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Text,
  ScrollView,
} from "react-native";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  runTransaction,
  addDoc,
} from "firebase/firestore";
import { SelectList } from "react-native-dropdown-select-list";
import axios from "axios";

const Payments = () => {
  const [BreadType, setBreadType] = useState("");
  const [Size, setSize] = useState("");
  const [purchaseQuantity, setPurchaseQuantity] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState({
    status: "idle",
    details: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [walletNumber, setWalletNumber] = useState("");
  const [paymentOption, setPaymentOption] = useState("MTN");
  const [paymentAmount, setPaymentAmount] = useState("");

  const breadTypeOptions = [
    { key: "SugarBread", value: "SugarBread" },
    { key: "ButterBread", value: "ButterBread" },
    // ... other bread types ...
  ];

  const paymentOptions = [
    { key: "MTN", value: "MTN" },
    { key: "ButterBread", value: "ButterBread" },
    // ... other payment options ...
  ];

  const sizeOptions = [
    { key: "Small", value: "Small" },
    { key: "Large", value: "Large" },
    // ... other sizes ...
  ];

  const handlePaymentSubmit = async () => {
    const paymentData = {
      amount: paymentAmount,
      paymentoption: paymentOption,
      walletnumber: walletNumber,
      description: "Payment for bread", // Adjust description as needed
    };

    try {
      const response = await axios.post(
        "http://192.168.43.190:3001/receiveMoney",  
        paymentData
      );
      setTransactionStatus(response.data);
      console.log("Payment successful");

      if (response.data.status === "OK") {
        const transactionDetails = {
          breadType: BreadType,
          size: Size,
          amount: paymentAmount,
          quantity: purchaseQuantity,
          timestamp: new Date(),
          userId: auth?.currentUser?.uid,
        };

        await addDoc(collection(db, "transactions"), transactionDetails);
        console.log("Transaction details saved successfully");
      }
      Alert.alert(
        response.data.status === "OK" ? "Payment successful" : "Payment failed",
        response.data.reason
      );

      
    } catch (error) {
      console.error("Payment error:", error);
      setTransactionStatus({ status: "FAILED", reason: error.message });
    }
  };const handlePreview = async () => {
    try {
      // Check if bread type, size, and quantity are selected
      if (!BreadType || !Size || purchaseQuantity <= 0) {
        throw new Error("Please select bread type, size, and quantity");
      }
  
      const productSnapshot = await getDocs(
        query(
          collection(db, "Product"),
          where("Type", "==", BreadType),
          where("Size", "==", Size)
        )
      );
      if (productSnapshot.empty) {
        throw new Error("No matching product found!");
      }
  
      const productData = productSnapshot.docs[0].data();
      const productPrice = parseFloat(productData.Price); // Convert to number
      const quantity = parseInt(purchaseQuantity); // Convert to integer
  
      // Check if product price and quantity are valid numbers
      if (isNaN(productPrice) || isNaN(quantity)) {
        throw new Error("Invalid product price or quantity");
      }
  
      // Calculate total price
      const totalPrice = productPrice * quantity;
      setPaymentAmount(totalPrice.toString());
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
      // Handle error appropriately (e.g., show error message)
    }
  };
  
  const handlePurchase = async () => {
    let stockUpdated = false;
    let productRef = null;

    try {
      const q = query(
        collection(db, "Product"),
        where("Type", "==", BreadType),
        where("Size", "==", Size)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error("No matching product found!");
      }

      const productDoc = querySnapshot.docs[0];
      productRef = productDoc.ref;

      await runTransaction(db, async (transaction) => {
        const freshDoc = await transaction.get(productRef);
        if (!freshDoc.exists()) {
          throw new Error("Product does not exist!");
        }

        const newQuantity = freshDoc.data().quantity - purchaseQuantity;
        if (newQuantity < 0) {
          throw new Error("Insufficient stock!");
        }

        transaction.update(productRef, { quantity: newQuantity });
        stockUpdated = true;
      });

      const paymentSuccessful = await processPayment();
      if (!paymentSuccessful) {
        throw new Error("Payment failed");
      }

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

      console.log("Purchase successful");
    } catch (error) {
      console.error("Purchase or payment failed:", error.message);

      if (stockUpdated && productRef) {
        await runTransaction(db, async (transaction) => {
          const doc = await transaction.get(productRef);
          if (doc.exists()) {
            const restoredQuantity = doc.data().quantity + purchaseQuantity;
            transaction.update(productRef, { quantity: restoredQuantity });
          }
        });
      }

      setTransactionStatus({ status: "failed", details: null });
    }
    setModalVisible(false);
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
        }
      };
      saveTransaction();
    }
  }, [transactionStatus]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
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
            />
          </View>
  
          <View style={styles.selectContainers}>
            <Text style={styles.label}>Size</Text>
            <SelectList
              setSelected={setSize}
              data={sizeOptions}
              placeholder="Select Size"
              boxStyles={styles.selectBox}
            />
          </View>
          <View style={styles.selectContainers}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
  style={styles.input}
  value={String(purchaseQuantity)}
  onChangeText={(value) => {
    setPurchaseQuantity(Number(value));
    handlePreview(); // Call handlePreview when quantity changes
  }}
  placeholder="Quantity"
  keyboardType="numeric"
/>
          </View>
          
        

  
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
        <View style={styles.modalCenteredView}>
          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={styles.modalScrollViewContent}>
              <Text style={styles.modalHeader}>Payment Details</Text>
              <View style={styles.modalInputContainer}>
                <TextInput
                  style={styles.modalInput}
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                  keyboardType="numeric"
                  placeholder="Enter amount"
                  editable={false} 
                />
                <TextInput
                  style={styles.modalInput}
                  value={walletNumber}
                  onChangeText={setWalletNumber}
                  keyboardType="numeric"
                  placeholder="Enter wallet number"
                />
              </View>
              <Text style={styles.label}>Payment Option</Text>
              <SelectList
                setSelected={setPaymentOption}
                data={paymentOptions}
                placeholder="Select Payment Option"

                boxStyles={[styles.modalselectBox]} // Adjusted width
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  onPress={handlePaymentSubmit}
                  style={styles.modalButton}
                >
                  <Text style={styles.buttonText}>Purchase</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={[styles.modalButton, styles.cancelButton]}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
    width: "90%",
  },
  selectContainers: {
    marginBottom: 20,
    width: "90%",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#003366",
    textAlign: "left",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  selectBox: {
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#003366",
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
    width: "100%",
  },
  buttonContainer: {
    marginTop: 10,
    width: "90%",
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
  cancelButton: {
    backgroundColor: "#FF3C4A",
    marginLeft: 10,
  },
  modalCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    height: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: "48%", // Set the height to 50%
  },

  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#003366",
    marginBottom: 10,
  },

  modalselectBox: {
    width: "80%",
  },

  modalInput: {
    height: 40,
    width: "80%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#003366",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  modalButton: {
    backgroundColor: "#00A5ED",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    flex: 1,
  },
  modalInputContainer: {
    marginBottom: 15,
    width: "80%",
  },
});

export default Payments;
