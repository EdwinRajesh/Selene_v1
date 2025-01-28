import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import moment from 'moment';
import DropdownComponent from '@/src/components/Month'; // Adjust the import path as necessary
import Calendar from '@/src/components/Calender';

const HomeScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <View style={styles.container}>
      
      <DropdownComponent />
      
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
  
});

export default HomeScreen;