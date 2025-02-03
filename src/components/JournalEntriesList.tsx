import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { JournalEntry } from '@/src/constants/Types'; // Adjust the import path as necessary
import lightColors from '../constants/Colors';

interface JournalEntriesListProps {
  entries: JournalEntry[];
}

const JournalEntriesList: React.FC<JournalEntriesListProps> = ({ entries }) => {
  const router = useRouter();

  const renderItem = ({ item }: { item: JournalEntry }) => (
    <TouchableOpacity
      style={styles.journalContainer}
      onPress={() => {
        router.push(`/journals/${item.id}`);    
       }}
    >
      <View style={styles.journalFlex}>
        <Text style={styles.journalTitle}>{item.title}</Text>
        <Text style={styles.journalDate}>{item.date}</Text>
      </View>
      <Text style={styles.journalContent}>{item.content}</Text>
      {item.images && item.images.map((image, index) => (
        <Image key={index} source={{ uri: image }} style={styles.journalImage} />
      ))}
      {item.tags && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>{tag}</Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={entries}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 16,
  },
  journalContainer: {
    marginHorizontal:16,
    marginBottom: 8,
    padding: 16,
    height: 116,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  journalFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  journalTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontFamily: 'firamedium',
  },
  journalDate: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 8,
  },
  journalContent: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'firaregular',
  },
  journalImage: {
    width: '100%',
    height: 200,
    marginBottom: 8,
    borderRadius: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: lightColors.accent,
    color: '#fff',
    borderRadius: 4,
    padding: 4,
    marginRight: 4,
    marginBottom: 4,
  },
});

export default JournalEntriesList;
