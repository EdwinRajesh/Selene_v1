import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import moment from 'moment'

interface DateProps {
  
  date: Date
  onSelectDate: (date: string) => void
  selected: string
}

const Date: React.FC<DateProps> = ({ date, onSelectDate, selected }) => {
  // if today, show 'Today'
  // if not today, show day of the week e.g 'Mon', 'Tue', 'Wed'
  const day = moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? 'Today' : moment(date).format('ddd')
  // get the day number e.g 1, 2, 3, 4, 5, 6, 7
  const dayNumber = moment(date).format('D')

  // get the full date e.g 2021-01-01 - we'll use this to compare the date to the selected date
  const fullDate = moment(date).format('YYYY-MM-DD')
  return (
    <TouchableOpacity
      onPress={() => onSelectDate(fullDate)}
      style={[styles.card, selected === fullDate && { backgroundColor: "#6146c6" }]}
    >
      <Text
        style={[styles.big, selected === fullDate && { color: "#fff" }]}
      >
        {day}
      </Text>
      <View style={{ height: 10 }} />
      <Text
        style={[styles.medium, selected === fullDate && { color: "#fff", fontWeight: 'bold', fontSize: 24 }]}
      >
        {dayNumber}
      </Text>
    </TouchableOpacity>
  )
}

export default Date

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#eee',
    borderRadius: 10,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    height: 90,
    width: 80,
    marginHorizontal: 5,
  },
  big: {
    fontSize: 18,
  },
  medium: {
    fontSize: 18,
  },
})