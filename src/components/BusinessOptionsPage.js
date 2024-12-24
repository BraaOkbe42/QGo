import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const BusinessOptionsPage = ({ route, navigation }) => {
  const { businessName } = route.params; // Get the business name from the previous page

  // Navigate to BranchesPage when "Book an Appointment" is clicked
  const handleBookAppointment = () => {
    navigation.navigate('BranchesPage', { businessName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Options for {businessName}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleBookAppointment} // Navigate to BranchesPage
      >
        <Text style={styles.buttonText}>Book an Appointment</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => alert('Opening hours of branches feature coming soon!')}
      >
        <Text style={styles.buttonText}>Opening Hours of Branches</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => alert('Required documents feature coming soon!')}
      >
        <Text style={styles.buttonText}>Required Documents</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => alert('Upload documents feature coming soon!')}
      >
        <Text style={styles.buttonText}>Upload Documents</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BusinessOptionsPage;
