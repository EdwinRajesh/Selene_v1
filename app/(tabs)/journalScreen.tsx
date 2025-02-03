import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserData } from '../providers/UserDataProvider'; // Adjust the import path as necessary
import SearchBar from '@/src/components/SearchBar';
import JournalButton from '@/src/components/JournalButton';
import moment from 'moment';
import JournalEntriesList from '@/src/components/JournalEntriesList';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import lightColors from '@/src/constants/Colors';

const JournalScreen = () => {
  const router = useRouter();
  const userData = useUserData();
  const user = FIREBASE_AUTH.currentUser;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      setLoading(false);
    }
  }, [userData]);

  const handlePress = () => {
    router.push('/journals/JournalEntry'); // Navigate to JournalEntryPage
  };

  const handleViewAllPress = () => {
    router.push('/journals/AllEntries'); // Navigate to AllEntriesPage
  };

  // Sort userData by date (assuming 'date' is in ISO format)
  const parseDate = (dateString: string) => {
    const [day, month, year] = dateString.split(' ');

    // Month name to month index mapping
    const monthMap: { [key: string]: number } = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const monthIndex = monthMap[month]; // Get the index of the month
    return new Date(year, monthIndex, parseInt(day)); // Create a Date object
  };

  // Sorting the journals by date
  const sortedEntries = userData
    ? [...userData].sort((a, b) => {
        return parseDate(b.date).getTime() - parseDate(a.date).getTime(); // Sorting by timestamp
      })
    : [];

  // Get the most recent entries (e.g., the last 3 entries)
  const recentEntries = sortedEntries.slice(0, 3);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={lightColors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar />
      
      <View style={styles.flexGrowContainer}>
        <JournalButton title="Create New Journal Entry" onPress={handlePress} />

        {userData && (
          <View style={styles.userDataContainer}>
            <View style={styles.journalHeader}>
              <Text style={styles.userDataText}>Recent Entries :</Text>
              <TouchableOpacity onPress={handleViewAllPress} style={styles.viewAllButton}>
                <View style={styles.viewAllContent}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <Ionicons name="chevron-forward" size={16} color={lightColors.primary} />
                </View>
              </TouchableOpacity>
            </View>
            <JournalEntriesList entries={recentEntries} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDataContainer: {
    marginTop: 16,
  },
  flexGrowContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  userDataText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  journalText: {
    fontSize: 14,
    marginVertical: 4,
  },
  viewAllButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 16,
    color: lightColors.primary,
  },
  viewAllContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  journalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default JournalScreen;
