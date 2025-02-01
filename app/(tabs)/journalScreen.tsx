import { View, StyleSheet,Text } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import SearchBar from '@/src/components/SearchBar';
import JournalButton from '@/src/components/JournalButton';
import SecondaryButton from '@/src/components/SecondaryButton';
import { useUserData } from '../providers/UserDataProvider';

const JournalScreen = () => {
  const userData = useUserData(); // Get journal entries
  console.log("what",userData);
  const router = useRouter();

  const handlePress = () => {
    router.push('/(journals)/JournalEntry'); // Navigate to JournalEntryPage
  };


  return (
    <View style={styles.container}>
      <SearchBar />
      <View style={styles.buttonStyle}>
      
        <JournalButton title="Create New Journal Entry" onPress={handlePress} />
        {/* <SecondaryButton title="Secondary Action" onPress={() => {}} width={200} height={56} /> */}


      </View>
      {userData && (
        <View style={styles.userDataContainer}>
          <Text style={styles.userDataText}>User Journals:</Text>
          {userData.map((journal) => (
            <Text key={journal.id} style={styles.journalText}>
              {journal.content}
            </Text>
          ))}
        </View>
      )}
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
  userDataContainer: {
    marginTop: 16,
  },
  userDataText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  journalText: {
    fontSize: 14,
    marginVertical: 4,
  },
});

export default JournalScreen;