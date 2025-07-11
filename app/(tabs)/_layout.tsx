import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Chercher',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="search" size={24} color={focused ? '#07AFAF' : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
           title: 'Ajouter',
          tabBarIcon: ({ focused }) => (
            <View style={styles.addButton}>
              <Ionicons name="add" size={30} color="#fff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="liste"
        options={{
           title: 'Données',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="list" size={24} color={focused ? '#07AFAF' : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
           title: 'Profil',
          headerShown: true,
          headerTitle: 'Mon Profil',
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={24}
              color="#07AFAF"
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            />
          ),
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name="user"  size={24} color={focused ? '#07AFAF' : color} />
            
          ),
        }}
      />
    
    </Tabs>
  );
}
const styles = StyleSheet.create({
  addButton: {
    width: 60,
    height: 60,
    backgroundColor: '#000',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
});