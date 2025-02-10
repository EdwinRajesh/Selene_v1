import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/FirebaseConfig';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { JournalEntry } from '@/src/constants/Types';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

// Define the context type
type UserDataContextType = {
  userData: JournalEntry[] | null;
  deleteJournal: (id: string) => Promise<boolean>;
  isLoading: boolean;
};

const UserDataContext = createContext<UserDataContextType | null>(null);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(FIREBASE_AUTH.currentUser);
  const [userData, setUserData] = useState<JournalEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Fetch journal data once user is available
  useEffect(() => {
    if (!user || loading) return;

    const journalsCollectionRef = collection(FIRESTORE_DB, 'users', user.uid, 'journals');
    
    const unsubscribeFirestore = onSnapshot(
      journalsCollectionRef,
      (querySnapshot) => {
        const journals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        } as JournalEntry));
        setUserData(journals);
      },
      (error) => {
        console.error("Error fetching user journals:", error);
        Alert.alert(
          "Error",
          "Failed to fetch your journals. Please try again later."
        );
      }
    );

    return () => unsubscribeFirestore();
  }, [user, loading]);

  // Enhanced delete function with confirmation and error handling
  const deleteJournal = async (id: string): Promise<boolean> => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to delete journals");
      return false;
    }

    try {
      // Show confirmation dialog
      return new Promise((resolve) => {
        Alert.alert(
          "Confirm Deletion",
          "Are you sure you want to delete this journal entry?",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => resolve(false)
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                try {
                  const journalRef = doc(FIRESTORE_DB, 'users', user.uid, 'journals', id);
                  await deleteDoc(journalRef);
                  
                  // Optimistically update the UI
                  setUserData((prevData) => 
                    prevData?.filter((entry) => entry.id !== id) || null
                  );

                  // Navigate back
                  
                    router.replace('/journalScreen'); // Fallback if no previous screen exists
                  
                  
                  resolve(true);
                } catch (error) {
                  console.error("Error deleting journal:", error);
                  Alert.alert(
                    "Error",
                    "Failed to delete the journal. Please try again."
                  );
                  resolve(false);
                }
              }
            }
          ]
        );
      });
    } catch (error) {
      console.error("Error in delete operation:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred. Please try again."
      );
      return false;
    }
  };

  return (
    <UserDataContext.Provider value={{ 
      userData, 
      deleteJournal,
      isLoading: loading 
    }}>
      {children}
    </UserDataContext.Provider>
  );
};

// Enhanced custom hook with better error message
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error(
      "useUserData must be used within a UserDataProvider. " +
      "Please wrap your component tree with UserDataProvider."
    );
  }
  return context;
};