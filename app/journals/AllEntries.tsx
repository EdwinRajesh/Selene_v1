import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { useUserData } from '../providers/UserDataProvider';
import JournalEntriesList from '@/src/components/JournalEntriesList';
import lightColors from '@/src/constants/Colors';

const AllEntries = () => {
    const router = useRouter();
      const userData = useUserData();
  return (
    <View>
       {userData && (
          <View style={styles.userDataContainer}>
            
            <JournalEntriesList entries={userData} />
          </View>

        )}
    </View>
  )
}

export default AllEntries
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
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
  