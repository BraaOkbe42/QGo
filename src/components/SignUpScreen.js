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
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [error, setError] = useState('');

//   const isIsraeliPhoneNumber = (phone) => {
//     const regex = /^(\+972|0)?5[0-9]{8}$/;
//     return regex.test(phone);
//   };

//   const handleSignUp = async () => {
//     if (password !== confirmPassword) {
//       setError('הסיסמאות אינן תואמות');
//       return;
//     }

//     if (!isIsraeliPhoneNumber(phoneNumber)) {
//       setError('Invalid Israeli phone number. Please use a valid number.');
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

//       // Save user data to Firestore
//       const userDocRef = doc(firestore, 'Users', user.uid);
//       await setDoc(userDocRef, {
//         fullName,
//         email: user.email,
//         phoneNumber,
//         createdAt: new Date().toISOString(),
//       });

//       console.log('User data saved to Firestore.');

//       // Navigate to the Home Page
//       navigation.navigate('HomePage', { email: user.email });
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
//         placeholder="Phone Number (e.g., 0521234567 or +972521234567)"
//         value={phoneNumber}
//         onChangeText={setPhoneNumber}
//         keyboardType="phone-pad"
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
//     textAlign: 'center',
//   },
//   link: {
//     color: 'blue',
//     marginTop: 10,
//     textAlign: 'center',
//   },
// });

// export default SignUpScreen;





import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { auth, firestore } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';

const translations = {
  he: {
    title: 'הרשמה',
    fullNamePlaceholder: 'שם מלא',
    emailPlaceholder: 'אימייל',
    phoneNumberPlaceholder: 'מספר טלפון (לדוגמה, 0521234567)',
    passwordPlaceholder: 'סיסמה',
    confirmPasswordPlaceholder: 'אישור סיסמה',
    signUpButton: 'הרשם',
    loginLink: 'יש לך חשבון? התחבר',
    errorPasswordsMismatch: 'הסיסמאות לא תואמות',
    errorInvalidPhone: 'מספר טלפון לא חוקי',
  },
  ar: {
    title: 'إنشاء حساب',
    fullNamePlaceholder: 'الاسم الكامل',
    emailPlaceholder: 'البريد الإلكتروني',
    phoneNumberPlaceholder: 'رقم الهاتف (مثل 0521234567)',
    passwordPlaceholder: 'كلمة المرور',
    confirmPasswordPlaceholder: 'تأكيد كلمة المرور',
    signUpButton: 'إنشاء حساب',
    loginLink: 'هل لديك حساب؟ تسجيل الدخول',
    errorPasswordsMismatch: 'كلمات المرور غير متطابقة',
    errorInvalidPhone: 'رقم الهاتف غير صالح',
  },
};

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const { language } = useContext(LanguageContext);

  const t = translations[language];

  const isIsraeliPhoneNumber = (phone) => {
    const regex = /^(\+972|0)?5[0-9]{8}$/;
    return regex.test(phone);
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError(t.errorPasswordsMismatch);
      return;
    }

    if (!isIsraeliPhoneNumber(phoneNumber)) {
      setError(t.errorInvalidPhone);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });

      const userDocRef = doc(firestore, 'Users', user.uid);
      await setDoc(userDocRef, {
        fullName,
        email: user.email,
        phoneNumber,
        createdAt: new Date().toISOString(),
      });

      navigation.navigate('HomePage', { email: user.email });
    } catch (err) {
      console.error('Error during sign-up:', err.message);
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.title}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder={t.fullNamePlaceholder}
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder={t.emailPlaceholder}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder={t.phoneNumberPlaceholder}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder={t.passwordPlaceholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder={t.confirmPasswordPlaceholder}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title={t.signUpButton} onPress={handleSignUp} />
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        {t.loginLink}
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
