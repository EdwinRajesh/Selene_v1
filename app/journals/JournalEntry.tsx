import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard, TextInput } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { randomUUID } from 'expo-crypto';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Picker } from '@react-native-picker/picker';
import lightColors from '@/src/constants/Colors';
import SecondaryButton from '@/src/components/SecondaryButton';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/FirebaseConfig';
import { collection, doc, setDoc } from '@firebase/firestore';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  time:string;
  images?: string[];
  tags?: string[];
}

const defaultTags = ['Personal', 'Work', 'Health', 'Travel', 'Goals', 'Hobbies'];

const JournalEntryPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [time, setTime] = useState(moment().format('HH:mm')); // Default to current time in "HH:mm" format
  const [date, setDate] = useState(moment().format('DD MMMM YYYY')); // Default to today's date in "18 March 2003" format
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState(defaultTags[0]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customTag, setCustomTag] = useState('');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleSave = async() => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) {
      alert('User not authenticated');
      return;
    }
    const newEntry: JournalEntry = {
      id: randomUUID(),
      title,
      content,
      time,
      date,
      images,
      tags,
    };
    try {
      await setDoc(doc(collection(FIRESTORE_DB, 'users', userId, 'journals'), newEntry.id), newEntry);
      alert('Journal entry saved successfully');
      router.back(); // Navigate to the previous page
      console.log(newEntry);
    } catch (error) {
      console.error('Error saving journal entry:', error);
      alert('Failed to save journal entry');
    }
  };

  const handleBack = () => {
    router.back(); // Navigate to the previous page
  };
  const onDateChange = ( event:any,selectedDate:string)=> {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setDate(moment(currentDate).format('DD MMMM YYYY'));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
   

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const recordAudio = () => {
    // Add your audio recording logic here
    console.log('Record audio button pressed');
  };

  const addTag = () => {
    if (customTag && !tags.includes(customTag)) {
      setTags([...tags, customTag]);
      setCustomTag('');
    } else if (!tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Appbar.Header style={styles.header}>
        <AntDesign name="back" size={26} color={lightColors.textSecondary} onPress={handleBack} />
        <Text style={styles.buttonText}>Create Journal Entry</Text>
        <SecondaryButton title="SAVE" onPress={handleSave} width={56} height={32} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.dateContainer}>
        <Text style={styles.dateTime}>{date}</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={26} color={lightColors.primary} />
          </TouchableOpacity>


        </View>
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        <View style={styles.pickerContainer}>
         <View style={styles.pickerDropdown}>
         <Picker
            selectedValue={selectedTag}
            onValueChange={(itemValue) => setSelectedTag(itemValue)}
            style={styles.picker}
          >
            {defaultTags.map((tag) => (
              <Picker.Item key={tag} label={tag} value={tag} style={styles.pickerItem} />
            ))}
          </Picker>
         </View>
          <TextInput
        style={styles.customTagInput}
        placeholder="Add custom tag"
        value={customTag}
        onChangeText={setCustomTag}
      />
          <TouchableOpacity onPress={addTag} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Tag</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tagContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <TextInput
          style={[styles.textInput, { fontSize: 22 }]}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />
        <TextInput
          style={styles.textInput}
          placeholder="Write your journal entry here..."
          multiline
          value={content}
          onChangeText={setContent}
        />
        
        <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </View>
      </ScrollView>
      {isKeyboardVisible && (
        <View style={styles.floatingTab}>
          <TouchableOpacity onPress={pickImage} style={styles.floatingButton}>
            <Ionicons name="image-outline" size={32} color={lightColors.secondary} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={recordAudio} style={styles.floatingButton}>
            <Ionicons name="mic-outline" size={32} color={lightColors.secondary} />
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Set background color to white
  },
  buttonText: {
    color: lightColors.accent, // White text color
    fontFamily: 'firabold',
    fontSize:18 // Custom font
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  content: {
    padding: 20,
  },
  dateTime: {
    color: lightColors.primary,
    fontFamily: 'firamedium', // Custom font
    fontSize: 24,
   
    marginHorizontal:16
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
    marginBottom: 20,
  },
  textInput: {
    padding: 4,
    fontSize: 18,
    fontFamily: 'firaregular',
    marginBottom: 8,
    marginHorizontal:16
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    
  },
  pickerDropdown: {
  borderBottomWidth: 1,
    flex:1,
    borderBlockColor:lightColors.primary,
  },

  customTagInput: {
    borderBottomWidth: 1,
    width:4,
    borderColor: lightColors.primary,
    flex: 1,
    padding: 14,
    fontSize: 18,
    fontFamily: 'firaregular',
    marginLeft: 4,
  },
  pickerItem: {
    fontFamily: 'firamedium',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: lightColors.primary,
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: lightColors.accent,
    fontFamily: 'firaregular',
    fontWeight: 'bold',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    marginHorizontal:16
  },
  tag: {
    backgroundColor: lightColors.accent,
    marginVertical: 8,
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
    
  },
  tagText: {
    color: lightColors.secondary,
    fontFamily: 'firamedium',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  divider: {
    width: 1,
    backgroundColor: lightColors.textLight,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  floatingTab: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: lightColors.accent,
    padding: 10,
    marginHorizontal: 96,
    borderRadius: 16,
    paddingVertical: 16,
  },
  floatingButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'firamedium', // Custom font
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default JournalEntryPage;