import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import moment from 'moment';
import DropdownComponent from '@/src/components/Month'; // Adjust the import path as necessary
import Calendar from '@/src/components/Calender';
import { FIREBASE_AUTH } from '@/FirebaseConfig';

const HomeScreen: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));
  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      setUserId(user.uid);
    }
  }, []);
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <View style={styles.container}>
      
      {/* <DropdownComponent /> */}
      <Calendar selectedDate={selectedDate} onSelectDate={handleSelectDate} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'firamedium', // Custom font
    color: '#2D3748',
    marginBottom: 16,
  },
  
});

export default HomeScreen;