import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { auth, EmailAuthProvider, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';

const VerifyCodeScreen = ({ route, navigation }) => {
  const { email, randomCode } = route.params;
  const [inputCode, setInputCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleVerifyAndReset = async () => {
    setError('');
  
    if (inputCode !== randomCode) {
      setError('Invalid recovery code.');
      return;
    }
  
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
  
    try {
      console.log('Attempting to reset password for email:', email);
  
      // Reauthenticate the user or use admin SDK for password update
      const user = auth.currentUser; // Ensure the user is authenticated
      if (!user) {
        setError('No authenticated user found. Please log in first.');
        return;
      }
  
      // Update the user's password
      await updatePassword(user, newPassword);
  
      console.log('Password reset successfully.');
      navigation.navigate('Login');
    } 
    
    catch (err) {
      console.error('Error resetting password:', err.message);
      setError('An error occurred while resetting the password.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Code</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Enter recovery code"
        value={inputCode}
        onChangeText={setInputCode}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="Reset Password" onPress={handleVerifyAndReset} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default VerifyCodeScreen;
