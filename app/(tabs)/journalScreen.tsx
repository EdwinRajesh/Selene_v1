import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import SearchBar from '@/src/components/SearchBar';
import JournalButton from '@/src/components/JournalButton';
import SecondaryButton from '@/src/components/SecondaryButton';

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
        <SecondaryButton title="Secondary Action" onPress={() => {}} width={200} height={56} />


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