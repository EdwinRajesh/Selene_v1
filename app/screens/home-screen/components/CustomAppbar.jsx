import React, { useState, useEffect } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { Text, StyleSheet, View, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/FirebaseConfig';
import { collection, query, doc, orderBy, onSnapshot } from 'firebase/firestore';

const CustomAppBar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const user = FIREBASE_AUTH.currentUser;
  const userId = user?.uid;

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSettings = () => {
    closeMenu();
    navigation.navigate('SettingsPage');
  };

  const handleSignOut = () => {
    closeMenu();
    FIREBASE_AUTH.signOut()
      .then(() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }))
      .catch((error) => {
        Alert.alert('Error', 'Failed to log out.');
        console.error('Logout error:', error);
      });
  };

  useEffect(() => {
    let unsubscribe;

    const fetchJournals = () => {
      setLoading(true);
      try {
        const userDocRef = doc(FIRESTORE_DB, 'users', userId);
        const journalsCollectionRef = collection(userDocRef, 'journals');
        const q = query(journalsCollectionRef, orderBy('createdAt', 'desc'));

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const fetchedJournals = [];
            snapshot.forEach((doc) => {
              fetchedJournals.push({ id: doc.id, ...doc.data() });
            });
            setJournals(fetchedJournals);
            setFilteredJournals(fetchedJournals); // Default to show all
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching journals:', error);
            Alert.alert('Error', 'Failed to load journal entries.');
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Error setting up listener:', error);
        setLoading(false);
      }
    };

    if (userId) fetchJournals();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId]);

  const toggleSearchMode = () => {
    setSearchMode(!searchMode);
    setSearchQuery('');
    setFilteredJournals(journals); // Reset to show all
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredJournals(journals);
    } else {
      const filtered = journals.filter((journal) =>
        journal.text.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredJournals(filtered);
    }
  };

  return (
    <Appbar.Header style={styles.header}>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="menu" size={30} onPress={openMenu} />}
      >
        <Menu.Item onPress={handleSettings} title="Settings" />
        <Menu.Item onPress={handleSignOut} title="Sign Out" />
      </Menu>

      {!searchMode ? (
        <Text style={styles.welcomeText}>Welcome</Text>
      ) : (
        <TextInput
          style={styles.searchInput}
          placeholder="Search Journals"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      )}

      <Appbar.Action
        icon={searchMode ? 'close' : 'magnify'}
        size={30}
        onPress={toggleSearchMode}
      />

      <View style={styles.divider}></View>
      <Appbar.Action
        size={30}
        icon="account-circle"
        onPress={() => {}}
      />

      {searchMode && (
        <View style={styles.resultsContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="teal" />
          ) : (
            <ScrollView style={styles.resultsList}>
              {filteredJournals.length > 0 ? (
                filteredJournals.map((journal) => (
                  <View key={journal.id} style={styles.journalCard}>
                    <Text style={styles.journalText}>{journal.text}</Text>
                    <Text style={styles.journalDate}>
                      {new Date(journal.createdAt.seconds * 1000).toLocaleString()}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noResultsText}>No results found</Text>
              )}
            </ScrollView>
          )}
        </View>
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'teal',
  },
  welcomeText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  divider: {
    width: 2,
    height: '60%',
    backgroundColor: 'white',
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  resultsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  resultsList: {
    flex: 1,
  },
  journalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  journalText: {
    fontSize: 16,
    color: '#333',
  },
  journalDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default CustomAppBar;
