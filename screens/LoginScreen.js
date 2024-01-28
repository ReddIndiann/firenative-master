


import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
 
  
  const navigation = useNavigation();

  // Replace with your sign-up logic
  const handleSignUp = () => {
    console.log('Handle sign up logic');
  };

  // Replace with your Google sign-up logic
  const handleGoogleSignUp = () => {
    console.log('Handle Google sign up logic');
  };

  // Replace with your navigation logic
  const handleAlreadyHaveAccount = () => {
    navigation.navigate('SignIn'); // Replace 'SignIn' with your actual sign-in route
  };

  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container}>
      <View style={styles.inputContainer}>

      <TextInput 
          placeholder='Name'
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
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
        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={handleGoogleSignUp} style={[styles.button, styles.buttonGoogle]}>
          <Image source={require('./download.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Sign Up with Google</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={handleAlreadyHaveAccount}>
          <Text style={styles.alreadyAccountText}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // ... other styles remain unchanged

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Match background color
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white', // Match input background color
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#e8e8e8', // Match border color
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    // backgroundColor: '#F9A826',
    backgroundColor: "#0782f9",
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white', // Text color for the button
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonGoogle: {
    backgroundColor: 'white',
    marginTop: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  alreadyAccountText: {
    marginTop: 20,
    color: 'grey',
  },
});

export default LoginScreen;
