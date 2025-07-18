import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { Text, View } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

 if (!loaded) {
  return <View><Text>Chargement des polices...</Text></View>;
}


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
<Stack>
  <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
  <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
  <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen name="+not-found" />
  <Stack.Screen name="TeacherListe" />
  <Stack.Screen name="StudentsListe"  />
  <Stack.Screen name="CoursListe"  />
    <Stack.Screen name="modifierEDT" />
  <Stack.Screen name="PageEns" options={{ title: 'Page des Enseignants' }} />
  <Stack.Screen name="PageStudent" options={{ title: 'Page des Etudiants' }} />
  <Stack.Screen name="etudiantPage" options={{ title: 'Etudiants' }} />
  <Stack.Screen name="EmploiDuTempsScreen" options={{ title: 'EDT' }} />

</Stack>
<StatusBar style="auto" />
    </ThemeProvider>
  );
}
