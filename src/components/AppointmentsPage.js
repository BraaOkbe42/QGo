// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   Dimensions,
// } from 'react-native';
// import { firestore, auth } from '../services/firebase'; // Import auth to get the current user's details
// import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const AppointmentsPage = ({ route }) => {
//   const { branch } = route.params; // Branch details from the previous page
//   const [workingHours, setWorkingHours] = useState([]);
//   const [selectedDay, setSelectedDay] = useState(new Date());
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [bookedSlots, setBookedSlots] = useState([]);
//   const [error, setError] = useState('');
//   const [fullName, setFullName] = useState('');

//   useEffect(() => {
//     if (!branch) {
//       setError('Branch details are missing.');
//       return;
//     }

//     // Fetch branch working hours
//     if (branch.working_hours) {
//       setWorkingHours(branch.working_hours);
//     } else {
//       setError('Working hours are not available for this branch.');
//     }
//   }, [branch]);

//   // Fetch user's full name
//   useEffect(() => {
//     const fetchUserFullName = async () => {
//       try {
//         const userDoc = doc(firestore, 'Users', auth.currentUser.uid);
//         const userSnapshot = await getDoc(userDoc);
//         if (userSnapshot.exists()) {
//           setFullName(userSnapshot.data().fullName);
//         } else {
//           console.error('User document not found.');
//           setError('Failed to fetch user details.');
//         }
//       } catch (err) {
//         console.error('Error fetching user details:', err.message);
//         setError('Failed to fetch user details.');
//       }
//     };

//     fetchUserFullName();
//   }, []);

//   // Generate available slots when a day is selected
//   useEffect(() => {
//     if (workingHours.length > 0) {
//       generateAvailableSlots(selectedDay);
//     }
//   }, [selectedDay, workingHours]);

//   const generateAvailableSlots = async (date) => {
//     try {
//       const dayIndex = date.getDay(); // Numeric index for the day (0 = Sunday, ..., 6 = Saturday)
//       const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//       const selectedDayName = dayNames[dayIndex]; // Map the numeric index to the day name
//       console.log('Selected Day Name:', selectedDayName);

//       // Find working hours for the selected day name
//       const daySchedule = workingHours.find((schedule) =>
//         schedule.days.includes(selectedDayName) // Match day name instead of numeric index
//       );

//       console.log('Matched Schedule:', daySchedule);

//       if (!daySchedule) {
//         setAvailableSlots([]);
//         setError('This branch is closed on the selected day.');
//         return;
//       }

//       const { from_time, to_time } = daySchedule;

//       // Generate 15-minute slots
//       const startTime = new Date(`${date.toISOString().split('T')[0]}T${from_time}`);
//       const endTime = new Date(`${date.toISOString().split('T')[0]}T${to_time}`);
//       const slots = [];

//       while (startTime < endTime) {
//         slots.push(new Date(startTime));
//         startTime.setMinutes(startTime.getMinutes() + 15); // Increment by 15 minutes
//       }

//       // Fetch booked slots
//       const bookedSlots = await fetchBookedSlots(date);
//       const filteredSlots = slots.filter(
//         (slot) =>
//           !bookedSlots.some(
//             (bookedSlot) =>
//               new Date(bookedSlot.seconds * 1000).toISOString() === slot.toISOString()
//           )
//       );

//       setAvailableSlots(filteredSlots);
//       setBookedSlots(bookedSlots.map((slot) => new Date(slot.seconds * 1000)));
//       setError('');
//     } catch (err) {
//       console.error('Error generating available slots:', err.message);
//       setError('Failed to generate slots. Please try again later.');
//     }
//   };

//   const fetchBookedSlots = async (date) => {
//     const appointmentsRef = collection(firestore, 'appointments');
//     const q = query(
//       appointmentsRef,
//       where('branch_id', '==', branch.id),
//       where('date', '==', date.toISOString().split('T')[0])
//     );

//     const snapshot = await getDocs(q);
//     return snapshot.docs.map((doc) => doc.data().time);
//   };

//   const handleBooking = async (slot) => {
//     try {
//       const appointmentRef = collection(firestore, 'appointments');
//       await addDoc(appointmentRef, {
//         branch_id: branch.id,
//         branch_name: branch.branch_name,
//         business_name: branch.business_name,
//         time: slot,
//         date: selectedDay.toISOString().split('T')[0],
//         customer_name: fullName, // Save the customer's full name
//       });

//       Alert.alert('Success', 'Appointment booked successfully.');
//       generateAvailableSlots(selectedDay); // Refresh slots
//     } catch (err) {
//       console.error('Error booking appointment:', err.message);
//       Alert.alert('Error', 'Failed to book the appointment. Please try again later.');
//     }
//   };

//   const renderSlot = ({ item }) => {
//     const isBooked = bookedSlots.some(
//       (bookedSlot) => bookedSlot.toISOString() === item.toISOString()
//     );
//     return (
//       <TouchableOpacity
//         style={[styles.slotCard, isBooked && styles.bookedSlot]}
//         onPress={() => !isBooked && handleBooking(item)}
//         disabled={isBooked}
//       >
//         <Text style={styles.slotText}>
//           {item.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Book an Appointment</Text>
//       {error ? <Text style={styles.error}>{error}</Text> : null}

//       {/* Date Picker */}
//       <DateTimePicker
//         value={selectedDay}
//         mode="date"
//         display="default"
//         onChange={(event, date) => {
//           if (date) {
//             setSelectedDay(date);
//           }
//         }}
//       />

//       {/* Available Slots */}
//       <FlatList
//         data={availableSlots}
//         renderItem={renderSlot}
//         keyExtractor={(item, index) => index.toString()}
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
//   slotCard: {
//     backgroundColor: '#4caf50',
//     padding: 10,
//     borderRadius: 5,
//     margin: 5,
//     width: Dimensions.get('window').width * 0.4,
//     alignItems: 'center',
//   },
//   bookedSlot: {
//     backgroundColor: '#ff4d4d',
//   },
//   slotText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   error: {
//     color: 'red',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
// });

// export default AppointmentsPage;








import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { firestore, auth } from '../services/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LanguageContext } from '../context/LanguageContext';

// Translations for UI text
const translations = {
  he: {
    bookAppointment: 'קבע תור',
    errorMessage: 'נכשל ביצירת משבצות. אנא נסה שוב מאוחר יותר.',
    successMessage: 'התור נקבע בהצלחה.',
    datePickerPlaceholder: 'בחר תאריך',
  },
  ar: {
    bookAppointment: 'حجز موعد',
    errorMessage: 'فشل إنشاء الفتحات. حاول مرة أخرى لاحقاً.',
    successMessage: 'تم حجز الموعد بنجاح.',
    datePickerPlaceholder: 'اختر تاريخاً',
  },
};

// Translations for branch and business names
const branchNameTranslations = {
  'סניף באר שבע קקל 554': 'فرع بئر السبع ككل 554',
};

const businessNameTranslations = {
  'משרד פנים': 'وزارة الداخلية',
};

const AppointmentsPage = ({ route }) => {
  const { branch } = route.params;
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const [workingHours, setWorkingHours] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [error, setError] = useState('');
  const [fullName, setFullName] = useState('');

  // Translate names based on the selected language
  const translateName = (name, translations) => {
    if (language === 'ar') {
      return translations[name] || name; // Arabic translation
    } else if (language === 'he') {
      return name; // Hebrew: return the original name
    }
    return name; // Fallback to the original name
  };

  const translatedBranchName = translateName(branch?.branch_name, branchNameTranslations);
  const translatedBusinessName = translateName(branch?.business_name, businessNameTranslations);

  useEffect(() => {
    if (!branch) {
      setError('Branch details are missing.');
      return;
    }

    if (branch.working_hours) {
      setWorkingHours(branch.working_hours);
    } else {
      setError('Working hours are not available for this branch.');
    }
  }, [branch]);

  useEffect(() => {
    const fetchUserFullName = async () => {
      try {
        const userDoc = doc(firestore, 'Users', auth.currentUser.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setFullName(userSnapshot.data().fullName);
        } else {
          setError('Failed to fetch user details.');
        }
      } catch (err) {
        setError('Failed to fetch user details.');
      }
    };

    fetchUserFullName();
  }, []);

  useEffect(() => {
    if (workingHours.length > 0) {
      generateAvailableSlots(selectedDay);
    }
  }, [selectedDay, workingHours]);

  const generateAvailableSlots = async (date) => {
    try {
      const dayIndex = date.getDay();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const selectedDayName = dayNames[dayIndex];

      const daySchedule = workingHours.find((schedule) =>
        schedule.days.includes(selectedDayName)
      );

      if (!daySchedule) {
        setAvailableSlots([]);
        setError('This branch is closed on the selected day.');
        return;
      }

      const { from_time, to_time } = daySchedule;

      const startTime = new Date(`${date.toISOString().split('T')[0]}T${from_time}`);
      const endTime = new Date(`${date.toISOString().split('T')[0]}T${to_time}`);
      const slots = [];

      while (startTime < endTime) {
        slots.push(new Date(startTime));
        startTime.setMinutes(startTime.getMinutes() + 15);
      }

      const bookedSlots = await fetchBookedSlots(date);
      const filteredSlots = slots.filter(
        (slot) =>
          !bookedSlots.some(
            (bookedSlot) =>
              new Date(bookedSlot.seconds * 1000).toISOString() === slot.toISOString()
          )
      );

      setAvailableSlots(filteredSlots);
      setBookedSlots(bookedSlots.map((slot) => new Date(slot.seconds * 1000)));
      setError('');
    } catch (err) {
      setError(t.errorMessage);
    }
  };

  const fetchBookedSlots = async (date) => {
    const appointmentsRef = collection(firestore, 'appointments');
    const q = query(
      appointmentsRef,
      where('branch_id', '==', branch.id),
      where('date', '==', date.toISOString().split('T')[0])
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data().time);
  };

  const handleBooking = async (slot) => {
    try {
      const appointmentRef = collection(firestore, 'appointments');
      await addDoc(appointmentRef, {
        branch_id: branch.id,
        branch_name: branch.branch_name,
        business_name: branch.business_name,
        time: slot,
        date: selectedDay.toISOString().split('T')[0],
        customer_name: fullName,
      });

      Alert.alert('Success', t.successMessage);
      generateAvailableSlots(selectedDay);
    } catch (err) {
      Alert.alert('Error', t.errorMessage);
    }
  };

  const renderSlot = ({ item }) => {
    const isBooked = bookedSlots.some(
      (bookedSlot) => bookedSlot.toISOString() === item.toISOString()
    );
    return (
      <TouchableOpacity
        style={[styles.slotCard, isBooked && styles.bookedSlot]}
        onPress={() => !isBooked && handleBooking(item)}
        disabled={isBooked}
      >
        <Text style={styles.slotText}>
          {item.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.bookAppointment}</Text>
      <Text style={styles.subTitle}>
        {translatedBranchName}, {translatedBusinessName}
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <DateTimePicker
        value={selectedDay}
        mode="date"
        display="default"
        onChange={(event, date) => date && setSelectedDay(date)}
      />

      <FlatList
        data={availableSlots}
        renderItem={renderSlot}
        keyExtractor={(item, index) => index.toString()}
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
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
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
  slotCard: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    width: Dimensions.get('window').width * 0.4,
    alignItems: 'center',
  },
  bookedSlot: {
    backgroundColor: '#ff4d4d',
  },
  slotText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default AppointmentsPage;
