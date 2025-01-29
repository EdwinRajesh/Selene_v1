import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import lightColors from '@/src/constants/Colors';
import SecondaryButton from '@/src/components/SecondaryButton';

const JournalEntryPage = () => {
  const router = useRouter();

  const handleSave = () => {
    // Add your save logic here
    console.log('Save button pressed');
  };

  const handleBack = () => {
    router.back(); // Navigate to the previous page
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        
        <AntDesign name="back" size={26} color={lightColors.textSecondary} onPress={handleBack}/>
        
        <SecondaryButton title="SAVE" onPress={handleSave} width={56} height={32}/>
      </Appbar.Header>
      <View style={styles.content}>
        <Text style={styles.title}>Journl Entry Page</Text>
        {/* Add your journal entry form or content here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Set background color to white
  },
  header:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:22,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'firamedium', // Custom font
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default JournalEntryPage;