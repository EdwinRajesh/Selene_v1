import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { doc, collection, addDoc } from 'firebase/firestore';

import * as ImagePicker from 'expo-image-picker';
import * as Audio from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { Entypo, FontAwesome, Feather } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/FirebaseConfig';

const JournalEntryPage = () => {
  const navigation = useNavigation();

  const [journalText, setJournalText] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);

  useEffect(() => {
    const currentDate = new Date();
    
    // Format the date in local format (e.g., 'MM/DD/YYYY')
    const formattedDate = currentDate.toLocaleDateString();

    // Format the time in local time format (e.g., 'HH:MM AM/PM')
    const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setDate(formattedDate);
    setTime(formattedTime);
  }, []);

  const addMedia = (newMedia) => {
    if (newMedia.type === 'image' || newMedia.type === 'video') {
      setSelectedImages((prevImages) => [...prevImages, newMedia]);
    } else if (newMedia.type === 'audio') {
      setAudioUri(newMedia.uri);
    }
  };

  const pickImageOrVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    if (!result.canceled) {
      const newMedia = { type: result.assets[0].type, uri: result.assets[0].uri };
      addMedia(newMedia);
    }
  };

  const captureMedia = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    if (!result.canceled) {
      const newMedia = { type: result.assets[0].type, uri: result.assets[0].uri };
      addMedia(newMedia);
    }
  };

  const pickAudioFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    if (result.type === 'success') {
      const newMedia = { type: 'audio', uri: result.uri };
      addMedia(newMedia);
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      } else {
        Alert.alert('Permission required', 'Please allow microphone access.');
      }
    } catch (error) {
      console.error('Recording Error:', error);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const newMedia = { type: 'audio', uri };
      addMedia(newMedia);
      setRecording(null);
    }
  };

  const handleSave = async () => {
    if (!journalText.trim() && selectedImages.length === 0) {
      Alert.alert('Error', 'Please add some text or media to save.');
      return;
    }

    try {
      const userId = FIREBASE_AUTH.currentUser?.uid; // Get the current user's UID

      if (!userId) {
        Alert.alert('Error', 'User is not logged in.');
        return;
      }

      const docData = {
        text: journalText,
        date,
        time,
        createdAt: new Date(),
      };

      // Reference the user's document and their journals subcollection
      const userDocRef = doc(FIRESTORE_DB, 'users', userId); // Reference to the user document
      const journalsCollectionRef = collection(userDocRef, 'journals'); // Subcollection under the user document

      // Add the journal entry to the journals subcollection
      await addDoc(journalsCollectionRef, docData);

      Alert.alert('Success', 'Journal entry saved successfully!');
      setJournalText('');
      setSelectedImages([]);
      
      // Navigate to the HomeScreen
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error saving journal:', error);
      Alert.alert('Error', 'Failed to save journal entry.');
    }
  };

  const renderMedia = (media, index) => {
    switch (media.type) {
      case 'image':
        return <Image key={index} source={{ uri: media.uri }} style={styles.media} />;
      case 'video':
        return (
          <View key={index} style={styles.mediaPlaceholder}>
            <Text style={styles.placeholderText}>[Video]</Text>
          </View>
        );
      case 'audio':
        return (
          <View key={index} style={styles.mediaPlaceholder}>
            <Text style={styles.placeholderText}>[Audio]</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateTimeText}>{date}</Text>
        <Text style={styles.dateTimeText}>{time}</Text>
      </View>

      <TextInput
        style={styles.journalInput}
        multiline
        numberOfLines={10}
        value={journalText}
        onChangeText={setJournalText}
        placeholder="Write your thoughts here..."
        textAlignVertical="top"
      />

      <View style={styles.mediaButtonsContainer}>
        <TouchableOpacity style={styles.mediaButton} onPress={pickImageOrVideo}>
          <Entypo name="image" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.mediaButton} onPress={captureMedia}>
          <FontAwesome name="camera" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.mediaButton} onPress={pickAudioFile}>
          <FontAwesome name="music" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mediaButton}
          onPress={recording ? stopRecording : startRecording}
        >
          {recording ? (
            <FontAwesome name="stop" size={30} color="red" />
          ) : (
            <Feather name="mic" size={30} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Entry</Text>
      </TouchableOpacity>

      <ScrollView horizontal style={styles.imageContainer}>
        {selectedImages.map((media, index) => renderMedia(media, index))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  journalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    height: 300,
  },
  mediaButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  mediaButton: {
    backgroundColor: 'teal',
    padding: 10,
    borderRadius: 8,
    flex: 0.3,
    margin: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'teal',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  media: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  mediaPlaceholder: {
    width: 200,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  placeholderText: {
    color: '#333',
    fontSize: 16,
  },
});

export default JournalEntryPage;
