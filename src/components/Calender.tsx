import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateComponent from './Date'; // Adjust the import path as necessary
import moment from 'moment';

interface CalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(moment().month());
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    // Generate an array of dates for the selected month
    const startOfMonth = moment().month(selectedMonth).startOf('month');
    const endOfMonth = moment().month(selectedMonth).endOf('month');
    const monthDates = [];
    for (let date = startOfMonth; date.isBefore(endOfMonth) || date.isSame(endOfMonth, 'day'); date.add(1, 'days')) {
      monthDates.push(date.clone().toDate());
    }
    setDates(monthDates);
  }, [selectedMonth]);

  return (
    <View style={styles.container}>
      
      <View style={styles.scroll}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {dates.map((date, index) => (
            <DateComponent
              key={index}
              date={date}
              onSelectDate={onSelectDate}
              selected={selectedDate}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginHorizontal: 16,
  },
  picker: {
    width: '100%',
    height: 50,
  },
  scroll: {
    flexDirection: 'row',
  },
});

export default Calendar;