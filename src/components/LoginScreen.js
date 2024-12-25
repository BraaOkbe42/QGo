// import React, { useState } from 'react';
// import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
// import { auth } from '../services/firebase';
// import { signInWithEmailAndPassword } from 'firebase/auth';

// const LoginScreen = ({ navigation }) => {
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = async () => {
//     try {
//       console.log('Attempting to log in user with email:', email);

//       // Sign in with email and password
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       console.log('User logged in successfully:', user);

//       // Navigate to the Home Page and pass the user's email
//       navigation.navigate('HomePage', { email: user.email });
//     } catch (err) {
//       console.error('Error during login:', err.message);
//       setError(err.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Log In</Text>
//       {error ? <Text style={styles.error}>{error}</Text> : null}
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
//       <Button title="Log In" onPress={handleLogin} />
//       <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
//         Don't have an account? Sign Up
//       </Text>
//       <Text style={styles.link} onPress={() => navigation.navigate('PasswordRecovery')}>
//         Forgot your password? Recover it here
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

// export default LoginScreen;










// import React, { useState } from 'react';
// import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
// import { auth } from '../services/firebase';
// import { signInWithEmailAndPassword } from 'firebase/auth';

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = async () => {
//     try {
//       console.log('מנסה להתחבר עם האימייל:', email);

//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       console.log('המשתמש התחבר בהצלחה:', user);

//       navigation.navigate('HomePage', { email: user.email });
//     } catch (err) {
//       console.error('שגיאה במהלך ההתחברות:', err.message);
//       setError(err.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>התחברות</Text>
//       {error ? <Text style={styles.error}>{error}</Text> : null}
//       <TextInput
//         style={styles.input}
//         placeholder="אימייל"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="סיסמה"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button title="התחבר" onPress={handleLogin} />
//       <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
//         אין לך חשבון? הירשם
//       </Text>
//       <Text style={styles.link} onPress={() => navigation.navigate('PasswordRecovery')}>
//         שכחת סיסמה? שחזר כאן
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

// export default LoginScreen;















import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { LanguageContext } from '../context/LanguageContext';

const translations = {
  he: {
    login: 'התחבר',
    emailPlaceholder: 'אימייל',
    passwordPlaceholder: 'סיסמה',
    logInButton: 'התחבר',
    signUpLink: 'אין לך חשבון? הירשם',
    forgotPasswordLink: 'שכחת את הסיסמה? שחזר כאן',
    toggleLanguage: 'عربي',
  },
  ar: {
    login: 'تسجيل الدخول',
    emailPlaceholder: 'البريد الإلكتروني',
    passwordPlaceholder: 'كلمة المرور',
    logInButton: 'تسجيل الدخول',
    signUpLink: 'ليس لديك حساب؟ سجل هنا',
    forgotPasswordLink: 'نسيت كلمة المرور؟ استعدها هنا',
    toggleLanguage: 'עברית',
  },
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { language, toggleLanguage } = useContext(LanguageContext);

  const t = translations[language];

  const handleLogin = async () => {
    try {
      console.log('Attempting to log in user with email:', email);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User logged in successfully:', user);

      navigation.navigate('HomePage', { email: user.email });
    } catch (err) {
      console.error('Error during login:', err.message);
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
        <Text style={styles.languageButtonText}>{t.toggleLanguage}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{t.login}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder={t.emailPlaceholder}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder={t.passwordPlaceholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={t.logInButton} onPress={handleLogin} />
      <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
        {t.signUpLink}
      </Text>
      <Text style={styles.link} onPress={() => navigation.navigate('PasswordRecovery')}>
        {t.forgotPasswordLink}
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
  },
  link: {
    color: 'blue',
    marginTop: 10,
    textAlign: 'center',
  },
  languageButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  languageButtonText: {
    fontSize: 16,
    color: 'blue',
  },
});

export default LoginScreen;
