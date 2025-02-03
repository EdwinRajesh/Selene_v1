import { View, Text, Image } from 'react-native';
import React, { useContext } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useUserData } from '../providers/UserDataProvider';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  images?: string[];
  tags?: string[];
}

const JournalDisplay = () => {
  const { id } = useLocalSearchParams();
  const userData = useUserData(); // assuming your context provides userData

  // Find the journal entry by id
  const journalEntry = userData?.find((entry: JournalEntry) => entry.id === id);

  return (
    <View style={{ padding: 20 }}>
      {journalEntry ? (
        <>
          {/* Displaying title */}
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{journalEntry.title}</Text>
          
          {/* Displaying date */}
          <Text style={{ fontSize: 16, color: 'gray' }}>{journalEntry.date}</Text>
          
          {/* Displaying content */}
          <Text style={{ marginVertical: 10 }}>{journalEntry.content}</Text>

          {/* Displaying images if they exist */}
          {journalEntry.images && journalEntry.images.length > 0 && (
            <View>
              {journalEntry.images.map((image, index) => (
                <Image 
                  key={index} 
                  source={{ uri: image }} 
                  style={{ width: '100%', height: 200, marginBottom: 10 }} 
                />
              ))}
            </View>
          )}

          {/* Displaying tags if they exist */}
          {journalEntry.tags && journalEntry.tags.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {journalEntry.tags.map((tag, index) => (
                <Text 
                  key={index} 
                  style={{ 
                    color: 'blue', 
                    marginRight: 10, 
                    fontSize: 16, 
                    fontWeight: '500' 
                  }}
                >
                  #{tag}
                </Text>
              ))}
            </View>
          )}
        </>
      ) : (
        <Text>Journal entry not found</Text>
      )}
    </View>
  );
}

export default JournalDisplay;
