import React, { createContext, useContext, useState, useEffect } from 'react';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

// Create Context
const UserDataContext = createContext(null);

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        try {
          const journalsCollectionRef = collection(FIRESTORE_DB, 'users', user.uid, 'journals');
          const querySnapshot = await getDocs(journalsCollectionRef);
          const journals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUserData(journals);
          
          console.log("User journals fetched successfully", journals);
        } catch (error) {
          console.error("Error fetching user journals:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserDataContext.Provider value={userData}>
      {children}
    </UserDataContext.Provider>
  );
};

// Custom Hook to Use User Data Anywhere
export const useUserData = () => useContext(UserDataContext);