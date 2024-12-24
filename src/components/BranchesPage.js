import React, { useEffect, useState } from 'react';
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

const BranchesPage = ({ route, navigation }) => {
  const { businessName } = route.params;
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchesCollection = collection(firestore, 'businesses');
        const q = query(branchesCollection, where('business_name', '==', businessName));
        const snapshot = await getDocs(q);
        const branchList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBranches(branchList);
        setFilteredBranches(branchList); // Initialize filtered list
      } catch (err) {
        console.error('Error fetching branches:', err.message);
        setError('An error occurred while fetching branches. Please try again later.');
      }
    };

    fetchBranches();
  }, [businessName]);

  const handleBranchPress = (branch) => {
    navigation.navigate('AppointmentsPage', { branch });
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = branches.filter((branch) =>
      branch.branch_name && branch.branch_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBranches(filtered);
  };

  const filterByLocation = () => {
    Alert.alert('Feature Coming Soon', 'Filter by location is not yet implemented.');
  };

  const filterByAvailability = () => {
    Alert.alert('Feature Coming Soon', 'Filter by availability is not yet implemented.');
  };

  const renderBranch = ({ item }) => (
    <TouchableOpacity
      style={styles.branchCard}
      onPress={() => handleBranchPress(item)}
    >
      <Text style={styles.branchName}>{item.branch_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Branches of {businessName}</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a branch"
        value={searchTerm}
        onChangeText={handleSearch}
      />

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <Button title="Filter by Location" onPress={filterByLocation} />
        <Button title="Filter by Availability" onPress={filterByAvailability} />
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
