// import React, { useState } from 'react';
// import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
// import { auth, firestore } from '../services/firebase';
// import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';

// const SignUpScreen = ({ navigation }) => {
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSignUp = async () => {
//     // Validate passwords
//     if (password !== confirmPassword) {
//       setError("Passwords don't match");
//       return;
//     }

//     try {
//       console.log('Signing up user with email:', email);

//       // Create a new user
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       console.log('User created successfully:', user);

//       // Set the displayName to fullName
//       await updateProfile(user, { displayName: fullName });
//       console.log('Full name set to:', fullName);

//      // Save user data to Firestore
//         const userDocRef = doc(firestore, 'Users', user.uid);
//         await setDoc(userDocRef, {
//         fullName,
//         email: user.email,
//         createdAt: new Date().toISOString(),
//         });


//       console.log('User data saved to Firestore.');

//       navigation.navigate('HomePage', { email: user.email })
//       // Navigate to Login page
//       // Alert.alert('Registration Successful', 'You can now log in.', [
//       //   { text: 'OK', onPress: () =>   navigation.navigate('HomePage', { email: user.email })},

//       // ]);
      
//     } catch (err) {
//       console.error('Error during sign-up:', err.message);
  
//       // Display a neat error message based on Firebase error codes
//       if (err.code === 'auth/email-already-in-use') {
//         setError('This email is already registered. Please log in or use a different email.');
//       } else if (err.code === 'auth/invalid-email') {
//         setError('The email address is not valid. Please enter a valid email.');
//       } else if (err.code === 'auth/weak-password') {
//         setError('The password is too weak. Please use a stronger password.');
//       } else {
//         setError('An error occurred. Please try again later.');
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sign Up</Text>
//       {error ? <Text style={styles.error}>{error}</Text> : null}
//       <TextInput
//         style={styles.input}
//         placeholder="Full Name"
//         value={fullName}
//         onChangeText={setFullName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Confirm Password"
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         secureTextEntry
//       />
//       <Button title="Sign Up" onPress={handleSignUp} />
//       <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
//         Already have an account? Log In
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 8,
//     borderRadius: 5,
//   },
//   error: {
//     color: 'red',
//     marginBottom: 10,
//   },
//   link: {
//     color: 'blue',
//     marginTop: 10,
//     textAlign: 'center',
//   },
// });

// export default SignUpScreen;













import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { auth, firestore } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const isIsraeliPhoneNumber = (phone) => {
    const regex = /^(\+972|0)?5[0-9]{8}$/;
    return regex.test(phone);
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!isIsraeliPhoneNumber(phoneNumber)) {
      setError('Invalid Israeli phone number. Please use a valid number.');
      return;
    }

    try {
      console.log('Signing up user with email:', email);

      // Create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User created successfully:', user);

      // Set the displayName to fullName
      await updateProfile(user, { displayName: fullName });
      console.log('Full name set to:', fullName);

      // Save user data to Firestore
      const userDocRef = doc(firestore, 'Users', user.uid);
      await setDoc(userDocRef, {
        fullName,
        email: user.email,
        phoneNumber,
        createdAt: new Date().toISOString(),
      });

      console.log('User data saved to Firestore.');

      // Navigate to the Home Page
      navigation.navigate('HomePage', { email: user.email });
    } catch (err) {
      console.error('Error during sign-up:', err.message);

      // Display a neat error message based on Firebase error codes
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please log in or use a different email.');
      } else if (err.code === 'auth/invalid-email') {
        setError('The email address is not valid. Please enter a valid email.');
      } else if (err.code === 'auth/weak-password') {
        setError('The password is too weak. Please use a stronger password.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number (e.g., 0521234567 or +972521234567)"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Log In
      </Text>
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
  link: {
    color: 'blue',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SignUpScreen;
