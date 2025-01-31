import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import lightColors from '@/src/constants/Colors';
import SecondaryButton from '@/src/components/SecondaryButton';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
  images?: string[];
  tags?: string[];
}

const JournalEntryPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [time, setTime] = useState(new Date().toISOString().split('T')[1].split('.')[0]); // Default to current time
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const handleSave = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title,
      content,
      date,
      time,
      images,
      tags,
    };
    // Add your save logic here
    console.log('Save button pressed');
    console.log('Journal Entry:', newEntry);
  };

  const handleBack = () => {
    router.back(); // Navigate to the previous page
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <AntDesign name="back" size={26} color={lightColors.textSecondary} onPress={handleBack} />
        <SecondaryButton title="SAVE" onPress={handleSave} width={56} height={32} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          style={styles.textInput}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Write your journal entry here..."
          multiline
          value={content}
          onChangeText={setContent}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Tags (comma separated)"
          value={tags.join(', ')}
          onChangeText={(text) => setTags(text.split(',').map(tag => tag.trim()))}
        />
        <SecondaryButton title="Add Image" onPress={pickImage} width={150} height={40} />
        <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Set background color to white
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  content: {
    padding: 20,
  },
  textInput: {
    borderColor: lightColors.accent,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    fontFamily: 'firaregular',
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  title: {
    fontFamily: 'firamedium', // Custom font
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default JournalEntryPage;