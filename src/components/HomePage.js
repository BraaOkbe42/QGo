// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
// import { firestore } from '../services/firebase';
// import { collection, getDocs } from 'firebase/firestore';

// const HomePage = ({ navigation }) => {
//   const [businesses, setBusinesses] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchBusinesses = async () => {
//       try {
//         const businessesCollection = collection(firestore, 'businesses');
//         const snapshot = await getDocs(businessesCollection);
//         const businessList = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         // Filter out duplicate business names
//         const uniqueBusinesses = Array.from(
//           new Map(businessList.map(item => [item.business_name, item])).values()
//         );

//         console.log('Fetched unique businesses:', uniqueBusinesses);
//         setBusinesses(uniqueBusinesses);
//       } catch (err) {
//         console.error('Error fetching businesses:', err.message);
//         setError('An error occurred while fetching businesses. Please try again later.');
//       }
//     };

//     fetchBusinesses();
//   }, []);


//   const handleBusinessPress = (businessName) => {
//     navigation.navigate('BusinessOptionsPage', { businessName });
//   };
  

//   const renderBusiness = ({ item }) => (
//     <TouchableOpacity
//       style={styles.businessCard}
//       onPress={() => handleBusinessPress(item.business_name)}
//     >
//       <Text style={styles.businessName}>{item.business_name}</Text>
//     </TouchableOpacity>
//   );
  

  

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to the Business Directory</Text>
//       {error ? <Text style={styles.error}>{error}</Text> : null}
//       <FlatList
//         data={businesses}
//         renderItem={renderBusiness}
//         keyExtractor={item => item.id}
//         numColumns={2}
//         columnWrapperStyle={styles.row}
//         contentContainerStyle={styles.listContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   listContainer: {
//     alignItems: 'center',
//   },
//   row: {
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   businessCard: {
//     backgroundColor: '#4caf50',
//     padding: 20,
//     borderRadius: 10,
//     width: Dimensions.get('window').width * 0.45,
//     alignItems: 'center',
//   },
//   businessName: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   error: {
//     color: 'red',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
// });

// export default HomePage;





import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { firestore } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';

const translations = {
  ar: {
    title: 'مرحبًا بكم في دليل الأعمال',
    error: 'حدث خطأ أثناء تحميل الشركات. يرجى المحاولة لاحقًا.',
    businessNames: {
      'משטרה': 'الشرطة',
      'משרד פנים': 'وزارة الدخلية',
      'דואר ישראל': 'مكتب البريد',
    },
  },
  he: {
    title: 'ברוכים הבאים למדריך העסקים',
    error: 'אירעה שגיאה בעת טעינת העסקים. אנא נסה שוב מאוחר יותר.',
  },
};

const HomePage = ({ navigation }) => {
  const [businesses, setBusinesses] = useState([]);
  const [error, setError] = useState('');
  const { language } = useContext(LanguageContext);

  const t = translations[language] || translations.he; // Default to Hebrew if language is not set

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const businessesCollection = collection(firestore, 'businesses');
        const snapshot = await getDocs(businessesCollection);
        const businessList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log('Fetched businesses:', businessList);
        setBusinesses(businessList);
      } catch (err) {
        console.error('Error fetching businesses:', err.message);
        setError(t.error);
      }
    };

    fetchBusinesses();
  }, [t.error]);

  const translateBusinessName = (name) => {
    if (language === 'ar') {
      return t.businessNames[name] || name; // Translate to Arabic or keep the original
    }
    return name; // Display Hebrew by default
  };

  const handleBusinessPress = (businessName) => {
    navigation.navigate('BusinessOptionsPage', { businessName });
  };

  const renderBusiness = ({ item }) => (
    <TouchableOpacity
      style={styles.businessCard}
      onPress={() => handleBusinessPress(item.business_name)}
    >
      <Text style={styles.businessName}>{translateBusinessName(item.business_name)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.title}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={businesses}
        renderItem={renderBusiness}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  businessCard: {
    backgroundColor: '#4caf50',
    padding: 20,
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.45,
    alignItems: 'center',
  },
  businessName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default HomePage;
