import React from 'react';
import { Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        title="Go to Home Screen"
        onPress={() => router.push('/(tabs)/homeScreen')}
      />
    </View>
  );
}
