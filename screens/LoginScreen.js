
import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity,
  Text, View, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const LoginScreen = () => {         
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){
        navigation.replace("TopTab")
      }
    })
    return unsubscribe
  }, [])
  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Signed in');
    } catch (err) {
      console.error(err);
  
      let errorMessage;
      switch (err.code) {
        case 'auth/wrong-password':
          errorMessage = 'The password is incorrect. Please try again.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email. Please sign up.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'The email address is invalid. Please enter a valid email.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This user has been disabled. Please contact support.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        default:
          errorMessage = 'An unexpected error occurred. Please try again.';
      }
  
      Alert.alert('Login Error', errorMessage);
    }
  };
  
  const handleAlreadyHaveAccount = () => {
    navigation.navigate('SignIn');
  };
  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container}>
      <Text style={styles.title}>Valley View Essentials</Text>
      <Text style={styles.header}>Login to Purchase</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput 
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAlreadyHaveAccount} >
          <Text style={styles.alreadyAccountText}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366', // Deep blue
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    color: '#003366',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: "#F2C94C", // Gold
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  alreadyAccountText: {
    marginTop: 20,
    color: 'grey',
  },
});

export default LoginScreen;
