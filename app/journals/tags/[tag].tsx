import { useUserData } from '@/app/providers/UserDataProvider';
import JournalEntriesList from '@/src/components/JournalEntriesList';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

const TagPage = () => {
  const { tag } = useLocalSearchParams();
  const { userData } = useUserData() || { userData: [] };
  const router = useRouter();

  // Filter journal entries by selected tag
  const filteredEntries = userData?.filter(entry => entry.tags?.includes(tag));

  return (
    <View style={styles.container}>
      {/* App Bar with Back Button */}
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={tag} />
      </Appbar.Header>

      {/* Journal Entries */}
      <View style={styles.content}>
        {filteredEntries.length > 0 ? (
          <JournalEntriesList entries={filteredEntries} />
        ) : (
          <Text style={styles.noEntries}>No entries found for this tag.</Text>
        )}
      </View>
    </View>
  );
};

export default TagPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  content: {
    flex: 1,
    padding: 20,
  },
  noEntries: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});
