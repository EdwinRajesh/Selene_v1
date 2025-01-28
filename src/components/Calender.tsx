import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import DateComponent from './Date'; // Adjust the import path as necessary
import moment from 'moment';

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  // Generate an array of dates for demonstration purposes
  const dates = Array.from({ length: 30 }, (_, i) => moment().subtract(i, 'days').toDate());

  return (
    <View style={styles.container}>
      <View style={styles.scroll}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) => setScrollPosition(e.nativeEvent.contentOffset.x)}
        >
          {dates.map((date, index) => (
            <DateComponent
              key={index}
              date={date}
              onSelectDate={handleSelectDate}
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
  },
  scroll: {
    flexDirection: 'row',
  },
});

export default Calendar;