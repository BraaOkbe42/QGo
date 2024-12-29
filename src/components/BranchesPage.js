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
  'משרד הפנים': 'وزارة الداخلية',
  'משטרה': 'الشرطة',
  'דואר ישראל' :'بريد اسرائيل'
};

const branchNameTranslations = {
    'אשקלון רחוב הרצל 18': 'أشكلون شارع هرتسل 18',
    'אשקלון רחוב אורט 24': 'أشكلون شارع أورط 24',
    'באר שבע שדרות דוד טוביהו 125': 'بئر السبع شارع دافيد طوبياهو 125',
    'באר שבע שדרות יצחק רגר 31': 'بئر السبع شارع يتسحاق ريجر 31',
    'אשדוד רחוב שבי ציון 6': 'أشدود شارع شافي تسيون 6',
    'אשדוד רחוב העצמאות 85': 'أشدود شارع الاستقلال 85',
    'דימונה שדרות הרצל 1': 'ديمونا شارع هرتسل 1',
    'דימונה רחוב ז\'בוטינסקי 5': 'ديمونا شارع جابوتنسكي 5',
    'אילת רחוב קאמן 8': 'إيلات شارع كامن 8',
    'אילת רחוב התמרים 1': 'إيلات شارع التمرين 1',
    'קריית גת שדרות לכיש 15': 'كريات جات شارع لحيش 15',
    'קריית גת שדרות מלכי ישראל 178': 'كريات جات شارع ملوك إسرائيل 178',
    'קריית מלאכי רחוב בן גוריון 2': 'كريات ملاخي شارع بن غوريون 2',
    'קריית מלאכי רחוב ויצמן 18': 'كريات ملاخي شارع فايتسمان 18',
    'נתיבות רחוב ירושלים 1': 'نتيفوت شارع القدس 1',
    'נתיבות אזור תעשייה קריית יהודית': 'نتيفوت منطقة صناعية كريات يهوديت',
    'רהט רחוב הראשי 100': 'رهط الشارع الرئيسي 100',
    'רהט שכונה 7': 'رهط الحي السابع',
    'שדרות רחוב הרצל 5': 'سديروت شارع هرتسل 5',
    'שדרות רחוב בן יהודה 10': 'سديروت شارع بن يهودا 10',
    'חורה רחוב הראשי': 'حورة الشارع الرئيسي',
    'לקיה רחוב הראשי': 'اللقية الشارع الرئيسي',
    'כסייפה רחוב הראשי': 'كسيفة الشارع الرئيسي',
    'ערערה בנגב רחוב הראשי': 'عرعرة في النقب الشارع الرئيسي',
    'שגב שלום רחוב הראשי': 'شقيب السلام الشارع الرئيسي',
    'עומר מרכז מסחרי': 'عومر المركز التجاري',
    'מיתר מרכז מסחרי': 'ميتار المركز التجاري',
    'להבים מרכז מסחרי': 'لحفيم المركز التجاري',
    'נווה זוהר רחוב הראשי': 'نيفيه زوهر الشارع الرئيسي',
    'עין יהב מרכז היישוב': 'عين يهاف مركز البلدة',
    'שדרות רחוב הרצל 1': 'سديروت شارع هرتسل 1',
    'באר שבע שדרות שז"ר 31': 'بئر السبع شارع شازار 31',
      'אשקלון רחוב נחל 1 מרכז צימר': 'أشكلون شارع ناحال 1 مركز تسيمر',
      'אשדוד רחוב הכלנית 13': 'أشدود شارع هكلانيت 13',
      'אילת רחוב חטיבת גולני 2': 'إيلات شارع حطيفات جولاني 2',
  


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