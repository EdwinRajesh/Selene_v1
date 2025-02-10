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

      {/* Content and First Image in the Same Row */}
      <View style={styles.contentRow}>
        <Text style={styles.journalContent} numberOfLines={2}>{item.content}</Text>
        {item.images?.length > 0 && (
          <Image source={{ uri: item.images[0] }} style={styles.journalImage} />
        )}
      </View>

      {/* Tags */}
      {item.tags?.length > 0 && (
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
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
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
    marginBottom: 4,
    fontFamily: 'firamedium',
  },
  journalDate: {
    fontSize: 14,
    color: 'gray',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  journalContent: {
    fontSize: 16,
    fontFamily: 'firaregular',
    flex: 1,
    marginRight: 10, // Spacing between text and image
  },
  journalImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  tag: {
    backgroundColor: lightColors.accent,
    color: '#fff',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 4,
    marginBottom: 4,
    fontSize: 12,
  },
});

export default JournalEntriesList;
