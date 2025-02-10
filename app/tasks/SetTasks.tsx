import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FIRESTORE_DB, FIREBASE_AUTH } from '@/FirebaseConfig';
import { addDoc, collection } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Snackbar, FAB } from 'react-native-paper';

const SetTask = () => {
  const [taskInput, setTaskInput] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [reminderType, setReminderType] = useState("none");
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const userId = FIREBASE_AUTH.currentUser?.uid;

  const addTask = async () => {
    await addDoc(collection(FIRESTORE_DB, "tasks"), { 
      task: taskInput, 
      dueDate,
      reminderType,
      reminderTime,
      userId,
      completed: false 
    });
    setSnackbarVisible(true);
  };

  return (
    <ScrollView style={styles.wrapper}>
      <Text style={styles.header}>New Task</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Task description"
        value={taskInput}
        onChangeText={setTaskInput}
      />

      <TouchableOpacity 
        style={styles.dateButton} 
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.buttonText}>Set Due Date</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setDueDate(date);
          }}
        />
      )}

      <Text style={styles.sectionHeader}>Reminder Settings</Text>
      
      <View style={styles.reminderContainer}>
        {['none', 'daily', 'weekly', 'custom'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.reminderButton,
              reminderType === type && styles.selectedReminder
            ]}
            onPress={() => {
              setReminderType(type);
              if (type === 'custom') setShowTimePicker(true);
            }}
          >
            <Text style={styles.reminderText}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {reminderType === 'custom' && showTimePicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          display="default"
          onChange={(event, time) => {
            setShowTimePicker(false);
            if (time) setReminderTime(time);
          }}
        />
      )}

      <FAB style={styles.fab} icon="check" onPress={addTask} />
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
        Task Added
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 20, backgroundColor: "#d3d3d3" },
  header: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  input: { 
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16
  },
  dateButton: {
    backgroundColor: "#008080",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center'
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333'
  },
  reminderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  reminderButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    marginVertical: 5
  },
  selectedReminder: {
    backgroundColor: '#008080',
    borderWidth: 2,
    borderColor: '#006666'
  },
  reminderText: {
    textAlign: 'center',
    color: '#333'
  },
  fab: { 
    position: "absolute", 
    right: 20, 
    bottom: 20, 
    backgroundColor: "#008080" 
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default SetTask;