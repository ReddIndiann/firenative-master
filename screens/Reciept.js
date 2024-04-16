// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons"; // Import Icon component
// import { auth, db } from "../firebase";
// import { signOut } from "firebase/auth";
// import { useNavigation } from "@react-navigation/native";
// import { doc, getDoc } from "firebase/firestore";

// const Receipt= () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const navigation = useNavigation();

//   useEffect(() => {
//     if (auth.currentUser) {
//       const userRef = doc(db, "userrs", auth.currentUser.uid);
//       getDoc(userRef)
//         .then((docSnapshot) => {
//           if (docSnapshot.exists()) {
//             setName(docSnapshot.data().displayName);
//             setEmail(docSnapshot.data().email); // Assuming you have email in user document
//           } else {
//             console.log("No such document!");
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching user document:", error);
//         });
//     }
//   }, []);

//   const signout = async () => {
//     try {
//       await signOut(auth);
//       navigation.navigate("Login");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const getInitials = (name) => {
//     return name
//       .split(" ")
//       .map((part) => part.charAt(0))
//       .join("");
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.headerContainer}>
//         <View style={[styles.userAvatar, { backgroundColor: "#00A5ED" }]}>
//           <Text style={styles.avatarText}>{getInitials(name)}</Text>
//         </View>
//         <Text style={styles.userName}>{name}</Text>
//         <Text style={styles.userEmail}>{email}</Text>
//       </View>

//       {settingsOptions.map((item, index) => (
//         <TouchableOpacity
//           key={index}
//           style={styles.optionContainer}
//           onPress={() => navigation.navigate(item.key)}
//         >
//           <Icon
//             name={item.icon}
//             size={24}
//             color="#00A5ED"
//             style={styles.icon}
//           />
//           <Text style={styles.optionText}>{item.title}</Text>
//         </TouchableOpacity>
//       ))}

//       <TouchableOpacity style={styles.optionContainer} onPress={signout}>
//         <Icon
//           name="exit-to-app"
//           size={24}
//           color="#00A5ED"
//           style={styles.icon}
//         />
//         <Text style={styles.optionText}>Sign Out</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   headerContainer: {
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "white",
//   },
//   userAvatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   avatarText: {
//     fontSize: 36,
//     fontWeight: "bold",
//     color: "white",
//   },
//   userName: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   userEmail: {
//     fontSize: 16,
//     color: "#00A5ED",
//   },
//   optionContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eaeaea",
//   },
//   optionText: {
//     fontSize: 18,
//     marginLeft: 20, // Add some space between the icon and text
//   },
//   icon: {
//     width: 24, // Specify the size of the icon
//     height: 24, // Ensure the icon has the correct height
//   },
//   // Add more styles as needed
// });

// export default Receipt;


import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Receipt = ({ route }) => {
  const { transaction } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Receipt Details</Text>
      <View style={styles.receiptContainer}>
        <Text style={styles.label}>Transaction Date:</Text>
        <Text style={styles.value}>{transaction.timestamp?.toDate().toLocaleString()}</Text>
        <Text style={styles.label}>Bread Type:</Text>
        <Text style={styles.value}>{transaction.breadType}</Text>
        <Text style={styles.label}>Size:</Text>
        <Text style={styles.value}>{transaction.Size}</Text>
        <Text style={styles.label}>Quantity:</Text>
        <Text style={styles.value}>{transaction.quantity}</Text>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>${transaction.amount}</Text>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{transaction.completed ? "Completed" : "Pending"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  receiptContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Receipt;
