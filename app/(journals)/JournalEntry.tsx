import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const JournalEntryPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal Entry Page</Text>
      {/* Add your journal entry form or content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Set background color to white
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default JournalEntryPage;