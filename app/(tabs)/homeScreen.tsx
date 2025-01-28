import React, { useContext, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import DateContext, { DateProvider } from '@/src/providers/dateProvider';
import Calendar from '@/src/components/Calender';

export default function HomeScreen() {
  const currentDate = useContext(DateContext);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (currentDate) {
      setSelectedDate(currentDate);
    }
  }, [currentDate]);

  return (
    <DateProvider>
      <View style={styles.container}>
        
        <Calendar />
      </View>
    </DateProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start', // Align items to the top-left corner
    justifyContent: 'flex-start', // Justify content to the top
    paddingTop: 20, // Optional: Add some padding to the top
  },
});