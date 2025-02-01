import React from 'react';
import { Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { ActivityIndicator } from 'react-native-paper';


export default function Index() {
  const [fontsLoaded]=useFonts({
    'firaregular':require('../assets/fonts/FiraSans-Regular.ttf'),
    'firabold':require('../assets/fonts/FiraSans-SemiBold.ttf'),
    'firamedium':require('../assets/fonts/FiraSans-Medium.ttf'),
    'firalight':require('../assets/fonts/FiraSans-Light.ttf'),
  });
  const router = useRouter();
  // if (!fontsLoaded) {
  //   return <ActivityIndicator/>;
  // }

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
        onPress={() => router.push('/Login')}
      />
    </View>
  );
}
