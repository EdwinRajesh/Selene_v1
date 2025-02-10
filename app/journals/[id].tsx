import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserData } from '../providers/UserDataProvider';
import { Ionicons } from '@expo/vector-icons';
import lightColors from '@/src/constants/Colors';

const JournalDisplay = () => {
  const { id } = useLocalSearchParams();
  const { userData, deleteJournal } = useUserData(); 
  const [loading, setLoading] = useState(false); 

  const journalEntries = userData || []; 
  const journalEntry = journalEntries.find((entry) => entry.id === id);
  const router = useRouter();

  const handleDelete = async () => {
    if (id) {
      setLoading(true);
      await deleteJournal(id);
      setLoading(false);
      router.back();
    }
  };

  const handleUpdate = () => {
    // Implement update navigation logic
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Journal Entry</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={lightColors.accent} />
          <Text style={styles.loadingText}>Deleting...</Text>
        </View>
      ) : journalEntry ? (
        <>
          <Text style={styles.entryTitle}>{journalEntry.title}</Text>
          <Text style={styles.date}>{journalEntry.date}</Text>
          <Text style={styles.content}>{journalEntry.content}</Text>
          {journalEntry.images && journalEntry.images.length > 0 && (
            <View>
              {journalEntry.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.image} />
              ))}
            </View>
          )}
          {journalEntry.tags && journalEntry.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {journalEntry.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>{tag}</Text>
              ))}
            </View>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleUpdate} style={styles.button}>
              <Ionicons name="create-outline" size={20} color="blue" />
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.button}>
              <Ionicons name="trash-outline" size={20} color="red" />
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.notFound}>Journal entry not found</Text>
      )}
    </View>
  );
};

export default JournalDisplay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: 'firamedium',
  },
  entryTitle: {
    fontSize: 24,
    fontFamily: 'firamedium',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: 'gray',
    fontFamily: 'firaregular',
  },
  content: {
    marginVertical: 10,
    fontSize: 16,
    fontFamily: 'firaregular',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  tag: {
    backgroundColor: lightColors.accent,
    marginVertical: 8,
    padding: 5,
    color: lightColors.secondary,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 5,
    fontFamily: 'firaregular',
  },
  notFound: {
    fontSize: 18,
    fontFamily: 'firaregular',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'firaregular',
    marginTop: 10,
  },
});
