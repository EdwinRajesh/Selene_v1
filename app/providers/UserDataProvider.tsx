import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/FirebaseConfig';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { JournalEntry } from '@/src/constants/Types'; // Adjust the import path as necessary

// Create Context
const UserDataContext = createContext<JournalEntry[] | null>(null);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<JournalEntry[] | null>(null);

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;
    console.log(user?.uid);
    if (user) {
      const journalsCollectionRef = collection(FIRESTORE_DB, 'users', user?.uid, 'journals');
      const unsubscribe = onSnapshot(journalsCollectionRef, (querySnapshot) => {
        const journals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JournalEntry));
        setUserData(journals);
        //console.log("User journals fetched successfully", journals);
      }, (error) => {
        console.error("Error fetching user journals:", error);
      });

      return () => unsubscribe();
    }
  }, []);
  const deleteJournal = async (id: string) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      try {
        // Delete from Firestore
        const journalRef = doc(FIRESTORE_DB, 'users', user.uid, 'journals', id);
        await deleteDoc(journalRef);

        // Optimistically update the UI by removing the deleted journal from userData
        setUserData((prevData) => prevData?.filter((entry) => entry.id !== id) || null);
      } catch (error) {
        console.error("Error deleting journal:", error);
      }
    }
  };

  return (
    <UserDataContext.Provider value={userData}>
      {children}
    </UserDataContext.Provider>
  );
};

// Custom Hook to Use User Data Anywhere
export const useUserData = () => useContext(UserDataContext);