import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import moment from 'moment';
import Calendar from '@/src/components/Calender';
import { useUserData } from '../providers/UserDataProvider';
import JournalEntriesList from '@/src/components/JournalEntriesList';

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));

  // Get all journal entries from context
  const { userData } = useUserData();

  // Convert selectedDate to match journal entries' date format
  const formattedDate = moment(selectedDate, 'YYYY-MM-DD').format('DD MMMM YYYY');

  // Filter journals & tasks for the selected date
  const filteredEntries = userData?.filter((entry) => entry.date === formattedDate);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <View style={styles.container}>
      <Calendar selectedDate={selectedDate} onSelectDate={handleSelectDate} />

      {/* Journal Entries for Selected Date */}
      <View style={styles.entriesContainer}>
        <Text style={styles.heading}>Journals for {formattedDate}</Text>

        {filteredEntries?.length === 0 ? (
          <Text style={styles.noEntries}>No entries for this date.</Text>
        ) : (
          <FlatList
            data={filteredEntries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <JournalEntriesList entries={[item]} />
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  entriesContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noEntries: {
    fontSize: 16,
    color: 'gray',
  },
  entry: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  entryContent: {
    fontSize: 14,
    color: 'gray',
  },
});

export default HomeScreen;
