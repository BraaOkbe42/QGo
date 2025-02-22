// import React, { useState } from 'react';
// import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
// import { auth, firestore } from '../services/firebase';
// import { fetchSignInMethodsForEmail } from 'firebase/auth';
// import { query, where, collection, getDocs } from 'firebase/firestore';

// const PasswordRecoveryScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState('');

//   const checkEmailRegistered = async (email) => {
//     for (let attempt = 0; attempt < 3; attempt++) {
//       const signInMethods = await fetchSignInMethodsForEmail(auth, email);
//       if (signInMethods.length > 0) return true;

//       console.log('Retrying fetchSignInMethodsForEmail...');
//       await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
//     }
//     return false;
//   };

//   const checkEmailInFirestore = async (email) => {
//     const usersRef = collection(firestore, 'Users');
//     const q = query(usersRef, where('email', '==', email));
//     const querySnapshot = await getDocs(q);
//     return !querySnapshot.empty;
//   };

//   const sendRecoveryCode = async () => {
//     if (!email) {
//       setError('Please enter your email.');
//       return;
//     }

//     const normalizedEmail = email.trim().toLowerCase();
//     console.log('Checking if email is registered:', normalizedEmail);

//     try {
//       const isEmailRegistered = await checkEmailRegistered(normalizedEmail);

//       if (!isEmailRegistered) {
//         const existsInFirestore = await checkEmailInFirestore(normalizedEmail);
//         if (!existsInFirestore) {
//           setError('This email is not registered.');
//           return;
//         }
//       }

//       console.log('Email is registered, proceeding to send recovery code.');

//       // Simulate sending a recovery code
//       const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
//       console.log('Generated recovery code:', randomCode);

//       // Navigate to the code verification page
//       navigation.navigate('VerifyCode', { email: normalizedEmail, randomCode });
//     } catch (err) {
//       console.error('Error during password recovery:', err.message);
//       setError('An error occurred. Please try again.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Password Recovery</Text>
//       {error ? <Text style={styles.error}>{error}</Text> : null}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your email"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <Button title="Send Recovery Code" onPress={sendRecoveryCode} />
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
// });

// export default PasswordRecoveryScreen;





















// import React, { useState } from 'react';
// import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
// import { auth, firestore } from '../services/firebase';
// import { fetchSignInMethodsForEmail } from 'firebase/auth';
// import { query, where, collection, getDocs } from 'firebase/firestore';

// const PasswordRecoveryScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState('');

//   const sendRecoveryCode = async () => {
//     if (!email) {
//       setError('אנא הזן את כתובת האימייל שלך.');
//       return;
//     }

//     try {
//       const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
//       console.log('קוד התאוששות שנוצר:', randomCode);

//       navigation.navigate('VerifyCode', { email, randomCode });
//     } catch (err) {
//       console.error('שגיאה במהלך שחזור הסיסמה:', err.message);
//       setError('אירעה שגיאה. נסה שוב.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>שחזור סיסמה</Text>
//       {error ? <Text style={styles.error}>{error}</Text> : null}
//       <TextInput
//         style={styles.input}
//         placeholder="הזן את האימייל שלך"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <Button title="שלח קוד התאוששות" onPress={sendRecoveryCode} />
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
// });

// export default PasswordRecoveryScreen;




















import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { LanguageContext } from '../context/LanguageContext';

const translations = {
  he: {
    title: 'שחזור סיסמה',
    emailPlaceholder: 'הכנס את האימייל שלך',
    recoveryButton: 'שלח קוד שחזור',
    errorEmailRequired: 'אנא הזן את האימייל שלך.',
    errorGeneric: 'אירעה שגיאה. אנא נסה שוב.',
  },
  ar: {
    title: 'استعادة كلمة المرور',
    emailPlaceholder: 'أدخل بريدك الإلكتروني',
    recoveryButton: 'إرسال رمز الاستعادة',
    errorEmailRequired: 'يرجى إدخال بريدك الإلكتروني.',
    errorGeneric: 'حدث خطأ. حاول مرة أخرى.',
  },
};

const PasswordRecoveryScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { language } = useContext(LanguageContext);

  const t = translations[language];

  const sendRecoveryCode = async () => {
    if (!email) {
      setError(t.errorEmailRequired);
      return;
    }

    try {
      // Simulated recovery logic
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('Generated recovery code:', randomCode);

      navigation.navigate('VerifyCode', { email, randomCode });
    } catch (err) {
      console.error('Error during password recovery:', err.message);
      setError(t.errorGeneric);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.title}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder={t.emailPlaceholder}
        value={email}
        onChangeText={setEmail}
      />
      <Button title={t.recoveryButton} onPress={sendRecoveryCode} />
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

export default PasswordRecoveryScreen;
