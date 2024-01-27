// import React, { useState, useEffect } from 'react'; // Corrected import here
// import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// import { auth } from '../firebase';
// import { signOut } from 'firebase/auth';
// import { useNavigation } from '@react-navigation/native';
// import { db } from '../firebase';
// import { doc, getDoc } from 'firebase/firestore'; // Import missing Firestore functions

// const settingsOptions = [
  
//   { key: 'account', title: 'Account' },
//   { key: 'notifications', title: 'Notifications' },
//   { key: 'privacy', title: 'Privacy' },
//   // Add more settings options here
// ];
// const navigation = useNavigation



// const SettingsScreen = () => {
//   const [name, setName] = useState('');
//   const navigation = useNavigation(); // Call useNavigation inside the component

//   useEffect(() => { // Corrected typo here
//     if (auth.currentUser) {
//       const userRef = doc(db, 'userrs', auth.currentUser.uid); // Corrected collection name
//       getDoc(userRef).then((docSnapshot) => {
//         if (docSnapshot.exists()) {
//           setName(docSnapshot.data().displayName);
//         } else {
//           console.log('No such document!');
//         }
//       }).catch((error) => {
//         console.error("Error fetching user document:", error);
//       });
//     }
//   }, []); // Removed auth, db from the dependency array

//   const signout = async () => {
//     try {
//       await signOut(auth);
//       navigation.navigate('Login');
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.item}
//       onPress={() => navigation.navigate(item.key)}
//     >
//       <Text style={styles.title}>{item.title}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={signout} style={styles.button}>
//         <Text style={styles.buttonText}>Sign out</Text>
//       </TouchableOpacity>
//       <Text style={styles.header}>Settings for {name}</Text>
//       <FlatList
//         data={settingsOptions}
//         renderItem={renderItem}
//         keyExtractor={item => item.key}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 22
//   },
//   item: {
//     padding: 10,
//     fontSize: 18,
//     height: 44,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     padding: 10
//   },
//   title: {
//     fontSize: 20,
//   }
// });

// export default SettingsScreen;





import {Switch, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useState, useEffect } from 'react'; // Corrected import here
import { View, Text, FlatList } from 'react-native';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore'; // Import missing Firestore functions



const SettingsScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

  const toggleSwitch = () => setIsDarkModeEnabled(previousState => !previousState);

  // Replace with your actual sign out function
  const navigation = useNavigation(); // Call useNavigation inside the component

  useEffect(() => { // Corrected typo here
    if (auth.currentUser) {
      const userRef = doc(db, 'userrs', auth.currentUser.uid); // Corrected collection name
      getDoc(userRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          setName(docSnapshot.data().displayName);
          setEmail(docSnapshot.data().country);
        } else {
          console.log('No such document!');
        }
      }).catch((error) => {
        console.error("Error fetching user document:", error);
      });
    }
  }, []); // Removed auth, db from the dependency array

  const signout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('./beto.jpeg')} style={styles.userAvatar} />
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userEmail}>{email}</Text>
      </View>
      <View style={styles.optionContainer}> 
        <Text style={styles.optionText}>Dark mode</Text>
        <Switch
          trackColor={{ false: "#767577", true: "gray" }}
          thumbColor={isDarkModeEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isDarkModeEnabled} 
        />
      </View>
      {/* Repeat for other options */}
      <TouchableOpacity style={styles.optionContainer}  onPress={() => navigation.navigate('history')}>
        <Text style={styles.optionText}>Transaction History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionContainer} onPress={signout}>
        <Text style={styles.optionText}>Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionContainer} onPress={signout}>
        <Text style={styles.optionText}>Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionContainer} onPress={signout}>
        <Text style={styles.optionText}>Sign Out</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f3f3f3',
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: 'gray',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  optionText: {
    fontSize: 16,
  },
  // Add styles for other components as needed
});

export default SettingsScreen;
