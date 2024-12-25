// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Dimensions,
//   TextInput,
//   Button,
//   Alert,
// } from 'react-native';
// import { firestore } from '../services/firebase';
// import { collection, query, where, getDocs } from 'firebase/firestore';

// const BranchesPage = ({ route, navigation }) => {
//   const { businessName } = route.params;
//   const [branches, setBranches] = useState([]);
//   const [filteredBranches, setFilteredBranches] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const branchesCollection = collection(firestore, 'businesses');
//         const q = query(branchesCollection, where('business_name', '==', businessName));
//         const snapshot = await getDocs(q);
//         const branchList = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setBranches(branchList);
//         setFilteredBranches(branchList); // Initialize filtered list
//       } catch (err) {
//         console.error('Error fetching branches:', err.message);
//         setError('An error occurred while fetching branches. Please try again later.');
//       }
//     };

//     fetchBranches();
//   }, [businessName]);

//   const handleBranchPress = (branch) => {
//     navigation.navigate('AppointmentsPage', { branch });
//   };

//   const handleSearch = (text) => {
//     setSearchTerm(text);
//     const filtered = branches.filter((branch) =>
//       branch.branch_name && branch.branch_name.toLowerCase().includes(text.toLowerCase())
//     );
//     setFilteredBranches(filtered);
//   };

//   const filterByLocation = () => {
//     Alert.alert('Feature Coming Soon', 'Filter by location is not yet implemented.');
//   };

//   const filterByAvailability = () => {
//     Alert.alert('Feature Coming Soon', 'Filter by availability is not yet implemented.');
//   };

//   const renderBranch = ({ item }) => (
//     <TouchableOpacity
//       style={styles.branchCard}
//       onPress={() => handleBranchPress(item)}
//     >
//       <Text style={styles.branchName}>{item.branch_name}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Branches of {businessName}</Text>

//       {/* Search Bar */}
//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search for a branch"
//         value={searchTerm}
//         onChangeText={handleSearch}
//       />

//       {/* Filter Buttons */}
//       <View style={styles.filterContainer}>
//         <Button title="Filter by Location" onPress={filterByLocation} />
//         <Button title="Filter by Availability" onPress={filterByAvailability} />
//       </View>

//       {error ? <Text style={styles.error}>{error}</Text> : null}
//       <FlatList
//         data={filteredBranches}
//         renderItem={renderBranch}
//         keyExtractor={(item) => item.id}
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
//   searchBar: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   listContainer: {
//     alignItems: 'center',
//   },
//   branchCard: {
//     backgroundColor: '#2196f3',
//     padding: 20,
//     borderRadius: 10,
//     width: Dimensions.get('window').width * 0.9,
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   branchName: {
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

// export default BranchesPage;




import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import { firestore } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';

// Translations for UI text
const translations = {
  he: {
    branchesOf: 'סניפים של',
    searchPlaceholder: 'חפש סניף',
    filterByLocation: 'סנן לפי מיקום',
    filterByAvailability: 'סנן לפי זמינות',
    comingSoon: 'תכונה זו תתווסף בקרוב!',
  },
  ar: {
    branchesOf: 'فروع',
    searchPlaceholder: 'ابحث عن فرع',
    filterByLocation: 'التصفية حسب الموقع',
    filterByAvailability: 'التصفية حسب التوافر',
    comingSoon: 'الميزة قادمة قريباً!',
  },
};

// Translations for business and branch names
const businessNameTranslations = {
  'משרד פנים': 'وزارة الداخلية',
};

const branchNameTranslations = {
  'סניף באר שבע קקל 554': 'فرع بئر السبع ككل 554',
};

const BranchesPage = ({ route, navigation }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const { businessName } = route.params;
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Translate business name based on the selected language
  const translateBusinessName = (name) => {
    if (language === 'ar') {
      return businessNameTranslations[name] || name; // Fallback to original name
    }
    return name;
  };

  // Translate branch name based on the selected language
  const translateBranchName = (name) => {
    if (language === 'ar') {
      return branchNameTranslations[name] || name; // Fallback to original name
    }
    return name;
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        // Use Hebrew name for querying the database
        const hebrewBusinessName = Object.keys(businessNameTranslations).find(
          (key) => businessNameTranslations[key] === businessName
        ) || businessName;

        console.log(`Fetching branches for business: "${hebrewBusinessName}"`);

        const branchesCollection = collection(firestore, 'businesses');
        const q = query(branchesCollection, where('business_name', '==', hebrewBusinessName));
        const snapshot = await getDocs(q);
        const branchList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log('Fetched branches:', branchList);
        setBranches(branchList);
        setFilteredBranches(branchList); // Initialize filtered list
      } catch (err) {
        console.error('Error fetching branches:', err.message);
        setError(t.comingSoon);
      }
    };

    fetchBranches();
  }, [businessName, t.comingSoon]);

  useEffect(() => {
    // Update the filteredBranches when the language changes
    const updatedBranches = branches.map((branch) => ({
      ...branch,
      branch_name: translateBranchName(branch.branch_name),
    }));
    setFilteredBranches(updatedBranches);
  }, [branches, language]);

  const handleBranchPress = (branch) => {
    navigation.navigate('AppointmentsPage', { branch });
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = branches.filter((branch) =>
      branch.branch_name &&
      translateBranchName(branch.branch_name)
        .toLowerCase()
        .includes(text.toLowerCase())
    );
    setFilteredBranches(filtered);
  };

  const filterByLocation = () => {
    Alert.alert(t.comingSoon);
  };

  const filterByAvailability = () => {
    Alert.alert(t.comingSoon);
  };

  const renderBranch = ({ item }) => (
    <TouchableOpacity
      style={styles.branchCard}
      onPress={() => handleBranchPress(item)}
    >
      <Text style={styles.branchName}>{translateBranchName(item.branch_name)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t.branchesOf} {translateBusinessName(businessName)}
      </Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder={t.searchPlaceholder}
        value={searchTerm}
        onChangeText={handleSearch}
      />

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <Button title={t.filterByLocation} onPress={filterByLocation} />
        <Button title={t.filterByAvailability} onPress={filterByAvailability} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={filteredBranches}
        renderItem={renderBranch}
        keyExtractor={(item) => item.id}
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
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  listContainer: {
    alignItems: 'center',
  },
  branchCard: {
    backgroundColor: '#2196f3',
    padding: 20,
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.9,
    alignItems: 'center',
    marginBottom: 15,
  },
  branchName: {
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

export default BranchesPage;
