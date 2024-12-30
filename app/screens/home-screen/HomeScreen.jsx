import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, ActivityIndicator, TextInput, Modal, Dimensions } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/FirebaseConfig';
import { collection, query, doc, orderBy, onSnapshot, deleteDoc } from 'firebase/firestore';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import CustomAppBar from './components/CustomAppbar';
import JournalEntryButton from './components/JournalEntryButton';
import JournalCalendar from './JournalCalender';
import TaskPage1 from './TaskPage1';
import ChatSum from './ChatSum';

const Tab = createBottomTabNavigator();

const HomeScreenContent = ({ navigation }) => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const user = FIREBASE_AUTH.currentUser;
  const userId = user?.uid;
  const swipeableRefs = useRef({});

  useEffect(() => {
    let unsubscribe;

    const setupJournalListener = () => {
      try {
        const userDocRef = doc(FIRESTORE_DB, 'users', userId);
        const journalsCollectionRef = collection(userDocRef, 'journals');
        const q = query(journalsCollectionRef, orderBy('createdAt', 'desc'));

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const journalEntries = [];
            snapshot.forEach((doc) => {
              journalEntries.push({
                id: doc.id,
                ...doc.data(),
              });
            });

            setJournals(journalEntries);
            setLoading(false);
          },
          (error) => {
            console.error('Error listening to journals:', error);
            Alert.alert('Error', 'Failed to load journal entries');
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Error setting up journal listener:', error);
        setLoading(false);
      }
    };

    if (userId) {
      setupJournalListener();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId]);

  const filterJournals = (query) => {
    return journals.filter((journal) => 
      journal.text.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleLongPress = (journal) => {
    setSelectedJournal(journal);
    setModalVisible(true);
  };

  const handleDelete = async (journalId) => {
    try {
      const userDocRef = doc(FIRESTORE_DB, 'users', userId);
      const journalDocRef = doc(collection(userDocRef, 'journals'), journalId);
      await deleteDoc(journalDocRef);
      Alert.alert('Success', 'Journal entry deleted successfully');
    } catch (error) {
      console.error('Error deleting journal:', error);
      Alert.alert('Error', 'Failed to delete journal entry');
    }
  };

  const renderRightActions = (journalId) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
        Alert.alert(
          'Delete Entry',
          'Are you sure you want to delete this journal entry?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Delete', 
              onPress: () => handleDelete(journalId),
              style: 'destructive'
            },
          ]
        );
      }}
    >
      <Icon name="delete" size={24} color="white" />
    </TouchableOpacity>
  );

  const renderJournalEntry = (journal) => (
    <Swipeable
      key={journal.id}
      ref={ref => swipeableRefs.current[journal.id] = ref}
      renderRightActions={() => renderRightActions(journal.id)}
      onSwipeableOpen={() => {
        Object.keys(swipeableRefs.current).forEach((key) => {
          if (key !== journal.id && swipeableRefs.current[key]) {
            swipeableRefs.current[key].close();
          }
        });
      }}
    >
      <TouchableOpacity
        onLongPress={() => handleLongPress(journal)}
        delayLongPress={500}
      >
        <View style={styles.journalCard}>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.journalDate}>{journal.date}</Text>
            <Text style={styles.journalTime}>{journal.time}</Text>
          </View>
          <Text style={styles.journalText} numberOfLines={3}>
            {journal.text}
          </Text>
          <Text style={styles.createdAt}>
            Created: {journal.createdAt?.toDate().toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="teal" style={styles.loader} />
        ) : (
          <ScrollView style={styles.journalList} showsVerticalScrollIndicator={false}>
            {filterJournals(searchQuery).length > 0 ? (
              filterJournals(searchQuery).map((journal) => renderJournalEntry(journal))
            ) : (
              <Text style={styles.noJournalsText}>No journal entries found</Text>
            )}
          </ScrollView>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView style={styles.modalScrollView}>
                <Text style={styles.modalDate}>
                  {selectedJournal?.date} at {selectedJournal?.time}
                </Text>
                <Text style={styles.modalText}>{selectedJournal?.text}</Text>
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <JournalEntryButton navigation={navigation} />
      </View>
    </GestureHandlerRootView>
  );
};

const CalendarScreen = () => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>Calendar Screen</Text>
  </View>
);

const MediaScreen = () => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>Media Screen</Text>
  </View>
);

const TasksScreen = () => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>Tasks Screen</Text>
  </View>
);

const HomeScreen = ({ navigation }) => {
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const toggleSearch = () => setIsSearch(!isSearch);
  const handleSearchChange = (text) => setSearchQuery(text);

  return (
    <View style={{ flex: 1 }}>
      <CustomAppBar 
        isSearch={isSearch} 
        toggleSearch={toggleSearch} 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <View style={styles.logoutContainer}></View>

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Journal') iconName = 'book';
            else if (route.name === 'Calendar') iconName = 'event';
            else if (route.name === 'Media') iconName = 'photo';
            else if (route.name === 'Tasks') iconName = 'check-circle';
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'teal',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { height: 60 },
          tabBarLabelStyle: { fontSize: 12, paddingBottom: 6 },
        })}
      >
        <Tab.Screen 
          name="Journal" 
          component={HomeScreenContent}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Calendar" 
          component={JournalCalendar} 
          options={{ headerShown: false }} 
        />
        <Tab.Screen 
          name="Chat" 
          component={ChatSum} 
          options={{ headerShown: false }} 
        />
        <Tab.Screen 
          name="Tasks" 
          component={TaskPage1} 
          options={{ headerShown: false }} 
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logoutContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 1,
  },
  journalList: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 16,
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
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  journalDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  journalTime: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  journalText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  createdAt: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    fontStyle: 'italic',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalScrollView: {
    maxHeight: Dimensions.get('window').height * 0.6,
  },
  modalDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  closeButton: {
    backgroundColor: 'teal',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  },
  noJournalsText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;