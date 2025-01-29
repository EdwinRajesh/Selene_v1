import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import SearchBar from '@/src/components/SearchBar';
import JournalButton from '@/src/components/JournalButton';

const JournalScreen = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push('/(journals)/JournalEntry'); // Navigate to JournalEntryPage
  };

  return (
    <View style={styles.container}>
      <SearchBar />
      <View style={styles.buttonStyle}>
        <JournalButton title="Create New Journal Entry" onPress={handlePress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Set background color to white
  },
  buttonStyle: {
    margin: 20,
  },
});

export default JournalScreen;