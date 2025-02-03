import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import Calendar from '@/src/components/Calender';
import { useUserData } from '../providers/UserDataProvider';
import { FIREBASE_AUTH } from '@/FirebaseConfig';

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));
  
  


  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <View style={styles.container}>
      <Calendar selectedDate={selectedDate} onSelectDate={handleSelectDate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'firamedium', // Custom font
    color: '#2D3748',
    marginBottom: 16,
  },
});

export default HomeScreen;